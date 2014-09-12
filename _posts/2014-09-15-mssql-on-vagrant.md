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
to do something in an better way feel free to submit a PR or drop a comment below
:)

Another good thing to mention is that this will eat **A LOT** of your disk space,
the Vagrant [base box](http://docs.vagrantup.com/v2/getting-started/boxes.html)
eats [around `3GB`](https://vagrantcloud.com/opentable/boxes/win-2008r2-standard-amd64-nocm)
of your hard drive and the VirtualBox VM with SQL Server installed along with
its dependencies will take around `XXX GB` of your disk (which is **_A LOT_**
when compared to Linux VMs / LXC containers)

## Requirements

GET FROM README (vbox, vagrant)
, so if you are low on disk space,
make sure you have at least `12 GB` before trying things out.

## Base box information

* Configured with 2 CPU and 2 GB memory by default.
* No updates or services packs applied
* The box is not activated. It has been created for testing and evaluation
  purposes only. Use of this machine for greater than 30 days will require a
  full license either via MSDN or your local Microsoft Reseller.
* The box has been created with [packer.io](http://www.packer.io/) using the
  templates we have made available [here](https://github.com/opentable/packer-images).

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
6. :beers:

When it comes to using a Windows VM with Vagrant, we also want to enable
[remote desktop connections](https://en.wikipedia.org/wiki/Remote_Desktop_Protocol)
as it seems to be the [primary method for performing administrative tasks on Windows](https://www.vagrantup.com/blog/feature-preview-vagrant-1-6-windows.html#toc_2).

I've automated all of that (apart from the :beers: of course :P) and the code can
be found on [GitHub](https://github.com/fgrehm/vagrant-mssql-express). What follows
is some information on how I automated that process and instructions on connecting
to the SQL Server from Rails apps.

Please keep in mind that the process of creating the Vagrant VM and setting things
up will take a while (around 15 minutes on my machine), so go grab a coffee when
you `vagrant up` for the first time :smirk:

### Downloading SQL Server Express installer

### Installing the .NET Framework

### Installing SQL Server and enabling TCP connections

* why sqlserver installation doesnt use powershell?

### Disabling Windows firewall

### Enabling Remote Desktop connections

* rdp / rdesktop


## Testing the SQL server installation

If all went well you can `vagrant rdp` and fire up the SQL Server Management console.
From there you can create databases, tables and also connect to remote servers
if you need.

```
GIF
```

Connecting to the SQL Server from an Ubuntu / Mac OS machine requires us to install
[freetds](). If you are on Ubuntu just `apt-get install XXX` and if you are on a Mac
`brew install XXX`

On the GitHub project I created, you'll find a Sinatra app that you can use to test
the connection with the SQL Server host:

```
GIF
```
