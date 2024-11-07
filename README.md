# Data Sharding with Docker and Node.js

This repository provides Docker Compose files and Node.js code examples for implementing **horizontal** and **vertical** data sharding. The examples here show how to set up sharded databases using Docker and interact with them using Node.js for efficient data management.

## Table of Contents

1. [Overview](#overview)
2. [Sharding Types](#sharding-types)
    - [Horizontal Sharding](#horizontal-sharding)
    - [Vertical Sharding](#vertical-sharding)
3. [Getting Started](#getting-started)

## Overview

Data sharding is a technique for partitioning a large database into smaller, more manageable pieces called "shards." This helps distribute the data across multiple databases, making it easier to scale and improving performance.

This repo demonstrates:
- **Horizontal Sharding**: Divides data by rows, each shard containing a subset of rows.
- **Vertical Sharding**: Divides data by columns, each shard containing specific columns.

## Sharding Types

### Horizontal Sharding

In horizontal sharding, a table is split by rows, with each partition handling a different subset of records. For instance, user data could be divided by geographic region.

### Vertical Sharding

In vertical sharding, a table is split by columns, with each partition containing only a subset of columns. This can optimize performance by minimizing the amount of data scanned during queries.

## Getting Started

### Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/)
