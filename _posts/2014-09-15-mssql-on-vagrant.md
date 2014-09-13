---
layout: post
title: "Microsoft SQL Server on Vagrant"
author: Fábio Rehm
categories:
  - fabio rehm
  - english
  - mssql
  - vagrant
---

I've recently been assigned to a Rails project that needs to connect to a SQL
Server database and on this post I'll go through the process of configuring a
Windows 2008 VM with SQL Server 2008 Express using [Vagrant](http://www.vagrantup.com/).
If you are just interested on the code you can get it from [here](https://github.com/fgrehm/vagrant-mssql-express).

<!--more-->

First of all, let me preface this post by saying that I haven't used Windows in
a loooong time and this was the first time I interacted with [PowerShell](http://en.wikipedia.org/wiki/Windows_PowerShell).
This post is a result of lots of googling and trial and error so if you know how
to do something in an better way feel free to submit a PR to the project or
drop a comment below :)

Another good thing to mention is that this will eat **A LOT** of your disk space,
the Vagrant [base box](http://docs.vagrantup.com/v2/getting-started/boxes.html)
eats [around `3GB`](https://vagrantcloud.com/opentable/boxes/win-2008r2-standard-amd64-nocm)
of your hard drive and the VirtualBox VM with SQL Server installed along with
its dependencies will take around `9 GB` of your disk (which is **_A LOT_**
when compared to Linux VMs / LXC containers)

## Requirements

* Vagrant 1.6+ (tested on 1.6.3)
* VirtualBox 4.3+ (tested on 4.3.16 on an Ubuntu host)
* Around `12GB` of disk space (`3GB` for base box + `~9GB` for the VM)

## Base box information

* Configured with 2 CPU and 2 GB memory by default.
* No updates or services packs applied
* The box is not activated. It has been created for testing and evaluation
  purposes only. Use of this machine for greater than 30 days will require a
  full license either via MSDN or your local Microsoft Reseller.
* The box has been created with [packer.io](http://www.packer.io/) using the
  templates made available [here](https://github.com/opentable/packer-images).

More information can be found on the [box page at Vagrant Cloud](https://vagrantcloud.com/opentable/boxes/win-2008r2-standard-amd64-nocm).

## Provisioning

It wasn't the first time I had to set up a Windows VM with SQL Server but it was
the first time I had to do it from the command line. The process is very
straightforward and it involves:

1. Downloading SQL Server Express with Management Studio installer from Microsoft
2. Installing the .NET Framework
3. Installing SQL Server and enabling TCP connections so we can connect to it from
   outside the VM (otherwise we'll only be able to connect to it from within the VM with
   Windows credentials)
4. Whitelisting SQL Server port on the Windows firewall (I chose to just disable it
   since it is not a production server)
5. Creating a [VirtualBox private network](http://docs.vagrantup.com/v2/networking/private_network.html)
   with the VM or the connection to the DB won't work (I can't remember why we
   need to do this but I got this from a blog post I found somewhere that I failed
   to keep track of the URL)
6. :beers: :beers: :beers: :beers: :beers: :beers: :beers: :beers:

When it comes to using a Windows VM with Vagrant, we also want to enable
[remote desktop connections](https://en.wikipedia.org/wiki/Remote_Desktop_Protocol)
as it seems to be the [primary method for performing administrative tasks on Windows](https://www.vagrantup.com/blog/feature-preview-vagrant-1-6-windows.html#toc_2).

I've automated all of that apart from the downloading the installer (and the :beers:
of course :P) and the code can be found on [GitHub](https://github.com/fgrehm/vagrant-mssql-express) so you are
almost a `git clone` and a `vagrant up` away from having a SQL Server instance at
your disposal. What follows is some information on how I automated that process and
instructions on connecting to the SQL Server from Ruby apps.

Please keep in mind that the process of creating the Vagrant VM from scratch after
downloading the base box and setting things up will take a while (around 15 minutes
on my machine), so go grab a coffee when you `vagrant up` for the first time
:smirk:

### Downloading SQL Server Express installer

This is currently the only manual step involved on the process, there was enough
experimenting in place already for me to figure out how to download a file using
PowerShell. Since you are likely to be on a Linux / Mac machine, you can easily
download it using `wget` or `curl`.

From the `vagrant-mssql-express` project root, run the following command to download
the installer:

{% highlight sh linenos %}
wget http://download.microsoft.com/download/0/4/B/04BE03CD-EAF3-4797-9D8D-2E08E316C998/SQLEXPRWT_x64_ENU.exe
{% endhighlight %}

Given that everything under the directory where your `Vagrantfile` is located
gets automagically shared with the VM by default, this should be enough to
continue with the provisioning process.

### Installing the .NET Framework

This is an easy one for Windows servers, we can just import the `ServerManager`
PowerShell module and add the Windows feature as outlined below:

{% highlight powershell linenos %}
# http://stackoverflow.com/a/9949105
$ErrorActionPreference = "Stop"

import-module servermanager
echo "Installing .NET Framework"
add-windowsfeature as-net-framework
{% endhighlight %}

.NET is not really required to run the SQL Server, but it is needed for the
Management Studio so that you can manage the server instance.

### Installing SQL Server and disabling the firewall

Given that you've downloaded the installer into the `vagrant-mssql-express` dir
root, the installer will be available from `C:\vagrant` from within the VM. To
install it I chose not to use PowerShell because the installer spawns a new process
and provisioning would continue without waiting for the installation to complete.

To speed up the provisioning process I also added the code to disable the Windows
Firewall on the same script as I had trouble disabling it with PowerShell too:

{% highlight bat linenos %}
@echo off

echo Installing SQL Server 2008 Express R2, it will take a while...
C:\vagrant\SQLEXPRWT_x64_ENU.exe /Q
                                 /Action=install
                                 /INDICATEPROGRESS
                                 /INSTANCENAME="SQLEXPRESS"
                                 /INSTANCEID="SQLExpress"
                                 /IAcceptSQLServerLicenseTerms
                                 /FEATURES=SQL,Tools
                                 /TCPENABLED=1
                                 /SECURITYMODE="SQL"
                                 /SAPWD="#SAPassword!"
echo Done!

echo Disabling firewall
netsh advfirewall set allprofiles state off
{% endhighlight %}

_Line breaks were added for readability, I'm not sure how Windows will handle that so
make sure you get the snippet in a single line if you are doing the process manually
and trying things out by hand_

That will install SQL Server 2008 Express and will set up the `sa` user password
to `#SAPassword!`. More information about the parameters that can be passed on to
the installer can be found [here](http://msdn.microsoft.com/en-us/library/ms144259%28v=SQL.100%29.aspx).

### Enabling connections to the default SQL Server TCP port

By default, the SQL Server instance will not expose the default TCP port to the
outer world and it will configure some random port, meaning we'd need to open up
the SQL Server settings to find out what port we should connect to.

The PowerShell script below will do the magic to make it allow connections on the
`1433` port:

{% highlight powershell linenos %}
# http://stackoverflow.com/a/9949105
$ErrorActionPreference = "Stop"

echo "Configuring TCP port"

# http://technet.microsoft.com/en-us/library/dd206997(v=sql.105).aspx
# Load assemblies
[reflection.assembly]::LoadWithPartialName("Microsoft.SqlServer.Smo")
[reflection.assembly]::LoadWithPartialName("Microsoft.SqlServer.SqlWmiManagement")

# http://www.dbi-services.com/index.php/blog/entry/sql-server-2012-configuring-your-tcp-port-via-powershell
# Set the port
$smo = 'Microsoft.SqlServer.Management.Smo.'
$wmi = new-object ($smo + 'Wmi.ManagedComputer')
$uri = "ManagedComputer[@Name='WIN-2008R2-STD']/ ServerInstance[@Name='SQLEXPRESS']/ServerProtocol[@Name='Tcp']"
$Tcp = $wmi.GetSmoObject($uri)
$wmi.GetSmoObject($uri + "/IPAddress[@Name='IPAll']").IPAddressProperties[1].Value="1433"
$Tcp.alter()

echo "DONE!"

echo "Restarting service..."
# Restart service so that configurations are applied
restart-service -f "SQL Server (SQLEXPRESS)"
echo "DONE!"
{% endhighlight %}

### Configuring a VirtualBox private network

That is handled by Vagrant itself and is a matter of adding the following line
to our `Vagrantfile`:

{% highlight powershell linenos %}
VAGRANTFILE_API_VERSION = "2"
Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  # ... other settings go here ...
  config.vm.network "private_network", ip: "192.168.50.4"
end
{% endhighlight %}

If the `192.168.50.4` ip collides with another machine on your network, you can
change it to another IP on the [private adress space](http://en.wikipedia.org/wiki/Private_network#Private_IPv4_address_spaces).

### Enabling Remote Desktop connections

Last but not least, we allow remote desktop connections with the following
PowerShell script:

{% highlight powershell linenos %}
# http://stackoverflow.com/a/9949105
$ErrorActionPreference = "Stop"

# http://networkerslog.blogspot.com.br/2013/09/how-to-enable-remote-desktop-remotely.html
set-ItemProperty -Path 'HKLM:\System\CurrentControlSet\Control\Terminal Server'-name "fDenyTSConnections" -Value 0
{% endhighlight %}

## Testing the SQL server installation

Given that you have the Remote Desktop client installed on your host (`apt-get install rdesktop`
on Ubuntu) and that all went well with the Vagrant provisioning process, you can
`vagrant rdp`, log in using `vagrant` as the username and password and fire up
the SQL Server Management Studio. From there you can create databases, tables
and even connect to remote servers if you need.

```
GIF
```

Connecting to the SQL Server from an Ubuntu / Mac OS host requires us to install
[freetds](http://www.freetds.org/). If you are on Ubuntu just `apt-get install freetds-*`
and if you are on a Mac `brew install freetds`

On the GitHub project I created, you'll find a Sinatra app that you can use to test
the connection with the SQL Server host.

```
GIF
```

Please note that the ActiveRecord DB adapter can't handle the `rake db:create`
task when using MSSQL databases, so you'll need to manually create that using
a Remote Desktop connection and the SQL Server Management Studio.

## That's it!

After spending so much time configuring Linux machines over the past couple years
it was a fun experience to learn some Windows "magic". I hope you enjoyed reading
this post and that it can save you some time on the future in case you need to
interact with SQL Server from a Linux / Mac machine like us :smiley:
