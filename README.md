# Credit card input form
This project is a simple credit card input form
## Online demo link:
[https://credit-card-input-form.herokuapp.com](https://credit-card-input-form.herokuapp.com/)
## Assumptions:

- Client-Server connection is websocket.
- If the last digit of the card is ‘5’ then the result is always failure, otherwise success.

## How to run:

1. To make sure that we have a bundled application, lets build our code:

```bash
make BuildUI
```

2. In one terminal Run UI code:

```bash
make RunUIProduction
```

3.Then in another terminal run a simple nodejs websocket server:

```bash
make RunServer
```