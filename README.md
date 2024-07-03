# gnovox - A Medium-like platform on Gno

**gnovox** is a decentralized blogging platform inspired from Medium and built on top
of the Gno.land blockchain.

gnovox allows you to connect with your Gno.land wallet, create accounts and share Markdown posts.

Built using the [Gno.land](https://github.com/gnolang/gno) tech stack, gnovox utilizes the Gno programming
language for its backend, and a classic React UI using `vite`.

## Run gnovox locally

gnovox consists of a React frontend, and a Gno backend (smart contract).
The frontend and backend code can be found at `ui/` and `contract/` respectively.

## Prerequisites

- NodeJS
- Yarn
- Go 1.21+

#### 1. Clone the gnovox repo

```bash
git clone git@github.com:RezaRahemtola/gnovox.git 
```

#### 2. Set up environment variables

Update the [`constants.ts`](front/src/constants.ts) with your values

### 4. Set up a local development node with `gnodev`

`gnodev` is a tool that allows you to run a local Gno.land node effortlessly.
To get started, install `gnodev`. To do this, clone the Gno monorepo:

```bash
git clone git@github.com:gnolang/gno.git 
```

From the root of the Gno repo, install the all the necessary binaries and
tools following the next steps:

1. Install the `gno` & `gnodev` binaries with the following command in the root of the cloned monorepo:

```bash
make install
```

2. Run the `gnodev` binary in the gnovox repo, giving it paths
   to the package and realm:

```bash
gnodev ./contract/p/gnovox/ ./contract/r/gnovox/
```

Running this command will spin up a local node that the gnovox UI
will be able to connect to.

Make sure that the chain RPC endpoint that `gnodev` is running on matches the one
in the `constants.ts` file.

#### 3. Start the frontend with `vite`

Start by running `yarn` in the `front/` folder. After `yarn` has installed all
the dependencies, run `yarn dev`.

### Conclusion

Congratulations! You are now officially running a local frontend connected to
gnovox!
