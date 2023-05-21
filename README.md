# AuthJS

[![npm version](https://img.shields.io/npm/v/@devts%2Fauthjs.svg)](https://www.npmjs.com/package/@devts/authjs)
[![Downloads](https://img.shields.io/npm/dm/@devts%2Fauthjs.svg?logo=npm)](https://www.npmjs.com/package/@devts/authjs)
[![type-coverage](https://img.shields.io/badge/dynamic/json.svg?label=type%20coverage&color=brightgreen&prefix=%E2%89%A5&suffix=%&query=$.typeCoverage.atLeast&uri=https%3A%2F%2Fraw.githubusercontent.com%2Findustriously%2Fauthjs%2Fmain%2Fpackage.json)](https://github.com/industriously/authjs)

Type-Safe Oauth Util Library

<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#installation">Installation</a></li>
    <li><a href="#example">example</a>
      <ul>
        <li><a href="#github">github</li>
      </ul>
    </li>
  </ol>
</details>

<!-- INSTALLATION -->

## Installation

```sh
npm i @devts/authjs
```

<!-- EXAMPLE -->

## Example

### Github

```typescript
import { Github } from "@devts/authjs";

const options: Github.IOauth2Options = {
  client_id: "",
  client_secret: "",
  redirect_uri: "",
  scope: ["user"]
};

const login_uri = Github.getLoginUri(options);
// request document api to login_uri

const { type, result } = await Github.getTokens(options)("code");

if (type === "error") {
  throw Error(result); // this is error message from gitub api.
}
if (type === "ok") {
  console.log(result); // this is github token.
  const user = await Github.getUser(result.access_token);
  if (user.type === "ok") {
    const userinfo: Github.IUser = user.result;
    console.log(userinfo);
  }

  const emails = await Github.getEmails(result.access_token);
  if (emails.type === "ok") {
    const email_list: Github.IEmail[] = emails.result;
    console.log(email_list);
  }
}
```
