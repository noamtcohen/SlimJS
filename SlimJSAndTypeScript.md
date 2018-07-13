## SlimJS and TypeScript

SlimJS can be used together with TypeScript and `ts-node`. You can use it as follows:

First, install `ts-node`:

```
npm install ts-node
```

Then, run SlimJS with `ts-node` by adding these four lines to a suitable FitNesse page:

```
!define TEST_SYSTEM {slim}
```
Tell FitNesse to use Slim.

```
!define COMMAND_PATTERN {./node_modules/.bin/ts-node ./node_modules/.bin/slimjs %p}
```
As the command to execute the fixtures, use ts-node and run slimjs through it.
(Adapt the relative paths as necessary.)

```
!path ./fixtures
```
Tell SlimJS where to find the fixtures. This directory should contain your TypeScript fixtures.

```
!define SLIM_PORT {9086}
```
Define any port (except 1) for compatibility with newer versions of FitNesse. 

### What's missing?

The next logical step would be to be able to test e.g. React code through SlimJS.
Unfortunately, I always ended up with React being undefined in my production code components.
If you happen to figure out how this can be achieved, [I'd be super grateful if you could send me a short message](mailto:nicole.m@gmx.de)!

