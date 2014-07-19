---
layout: post
title: "Starting with graph databases using Neo4j and Rails"
author: Tomás Müller
categories:
  - graph databases
  - neo4j
  - rails
---

Graphs are data structures highly useful to understand and represent many
real world problems in all kinds of areas such as business, government, and
science.

<!--more-->

To take advantage of graph databases we don't need to take a Masters on Graph
Theory. Instead of that, we must understand what a graph is, and be able to
build one drawing it on a paper.

## So, what is a graph?

Mathematically speaking, a graph is just a collection of vertices and edges. Or
if you don't like math, a set of nodes and relationships that connect
them. Graphs represent entities with nodes (vertices), and the way that entities
relate with each other are expressed by relationships (edges).

If you stop now and think about, this structure allow us to model countless
scenarios, from commercial systems to more complex problems such as optimization
algorithms.

This graph model is formally known as Property Graph. A property graph has the
following characteristics:

- It contains nodes and relationships
- Nodes contain properties (key-value pairs)
- Relationships are named and directed, and **always** have a start and end node
- Relationships can also contain properties (key-value pairs)

Despite being intuitive and easy to understand, the property graph model can be
used to describe almost all graph use cases.

## (Neo4j)-[:IS_A]->(Graph Database)

As you probably is thinking, graph databases use the graph model to store data
as a graph, with a structure consisting of vertices and edges, the two entities
used to model any graph. In addition, you can use all the algorithms from the
long history of graph theory to solve graph problems and in less time than
using relational database queries. I'll be covering some of them on my next posts.

![Bad UI](/blog/images/posts/2014-07-25/graph_databases.png)
<div style="text-align: center;">What's a Graph Database - <a href="http://www.neo4j.org/learn/neo4j">Courtesy of Neo4j friends</a>.</div>
<p> </p>

Beyond the image above, and now talking specifically about Neo4j, it is an open-source graph database supported by 
[Neo Technology](http://www.neotechnology.com/), that stores data using the Property Graph model. It is reliable, with 
full ACID transactions, expressive, with a powerful, human readable graph query language called Cypher, and simple, 
accessible by a convenient REST interface or an object-oriented Java API.

So, enough theory and talking for now.

Let's prepare our environment to play a little with Neo4j, and build a simple Rails application.

## Installing Neo4j

Installing Neo4j on development machines is very easy. If you are on OSX and is
using brew, go ahead and issue `brew install neo4j` on a terminal window.

Or, if you prefer, follow these five steps:

1. [Download the Neo4j Community package](http://www.neo4j.org/download)
2. Unzip on your installations folder, let's say `~/Applications/`
3. Create a symbolic link named `neo4j` to the unzipped folder. For instance: `ln -s ~/Applications/neo4j-community-2.1.2 ~/Applications/neo4j`
4. Create a environment variable named `NEO4J_HOME`, pointing to this symbolic link
5. Change the `PATH` environment variable, adding the `NEO4J_HOME/bin` to it

This way, in the future when you want to update the Neo4j database on your
machine, you must only download the new version, unpack, and update the symbolic
link pointing it to the new version.

When you have it installed, open a terminal window and type: `neo4j start`. This
command will start the Neo4j server on your machine. Now go check it on your
browser accessing `http://localhost:7474/`. You'll be presented with super nice
administration panel, where you can visualize the data stored on your neo4j
instance, manipulate data using the Cypher Query Language, and check all instance configuration.

![Neo4j empty admin](/blog/images/posts/2014-07-25/neo4j_admin_empty.png)
<div style="text-align: center;">Neo4j console - No data to display, fresh install.</div>
<p> </p>

## Neo4j on Rails

TODO.
