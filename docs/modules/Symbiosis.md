# Symbiosis — `web7.symbiosis`

Source controller: [`SymbiosisController.cs`](https://github.com/NextGenSoftwareUK/OASIS2/blob/main/WEB7/NextGenSoftware.OASIS.Web7.WebAPI/Controllers/SymbiosisController.cs)
Route prefix: `v1/symbiosis`
4 operation(s).

All methods are generated 1:1 from the controller's real `[Http*]` routes (see
[Conventions](../README.md#calling-any-endpoint)). They take a single args
object: any key matching a `{token}` in the route is substituted into the
URL; everything else becomes the query string (GET/DELETE) or JSON body
(POST/PUT).

## Methods

| Method | HTTP | Route | Route params |
| --- | --- | --- | --- |
| `endSession` | POST | `v1/symbiosis/sessions/{sessionId}/end` | `sessionId` |
| `getSession` | GET | `v1/symbiosis/sessions/{sessionId}` | `sessionId` |
| `startSession` | POST | `v1/symbiosis/sessions` | – |
| `submitSignals` | POST | `v1/symbiosis/sessions/{sessionId}/signals` | `sessionId` |

## Example

```js
const web7 = new Web7Client({ baseUrl: '...' });
web7.setToken(jwtToken); // reuse a WEB4 JWT

const { isError, message, result } = await web7.symbiosis.endSession({
    sessionId: '<sessionId>',
    /* ...other fields per the request body */
  });
if (isError) throw new Error(message);
console.log(result);
```
