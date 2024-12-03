# **Minting Approval System with Hyperledger Fabric v2.5.0**

This project implements a **Minting Approval System** using Hyperledger Fabric v2.5.0. It leverages the latest Fabric features to manage minting and currency requests in a secure, decentralized, and scalable manner.

---

## **Table of Contents**

1. [Overview](#overview)
2. [Features](#features)
3. [Prerequisites](#prerequisites)
4. [Setup and Installation](#setup-and-installation)
5. [Running the Network](#running-the-network)
6. [Deploying Chaincode](#deploying-chaincode)
7. [CI/CD Integration](#ci-cd-integration)
8. [Directory Structure](#directory-structure)
9. [Contributing](#contributing)
10. [License](#license)

---

## **Overview**

The Minting Approval System allows a governing entity to:
- Manage minting and currency requests.
- Track approval workflows with endorsements and HSM signatures.
- Deploy and interact with chaincodes in a Hyperledger Fabric network.

The system is built using:
- **Hyperledger Fabric v2.5.0**
- **Golang** for chaincode and backend logic.
- Docker for containerized deployment.
- GitHub Actions for CI/CD pipelines.

---

## **Features**

1. **Fabric Network**:
   - Multi-peer, multi-orderer configuration.
   - Secure TLS communication and CA setup.

2. **Minting Approval System**:
   - Minting and currency request state management.
   - Support for HSM-based signature verification.
   - Chaincode for minting and currency approval workflows.

3. **CI/CD Integration**:
   - Automated builds and deployments with GitHub Actions.
   - Dockerized chaincode for efficient deployment.

4. **Modern Practices**:
   - Refactored using Go modules.
   - YAML-based configurations.

---

## **Prerequisites**

Ensure the following tools are installed on your system:

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)
- [Hyperledger Fabric CLI](https://hyperledger-fabric.readthedocs.io/)
- [Git](https://git-scm.com/)
- [Go 1.17+](https://golang.org/)

Clone this repository:

```bash
git clone https://github.com/your-repo/minting-approval-system.git
cd minting-approval-system


Directory Structure
plaintext
Copy code
minting-approval-system/
├── chaincode-minting/        # Chaincode implementation in Golang
├── config/                   # YAML configurations for Fabric network
├── docs/                     # Documentation and architecture diagrams
├── scripts/                  # Bash scripts for network and chaincode operations
├── ci-cd/                    # GitHub Actions workflows
└── fabric-samples/           # Fabric sample network setup