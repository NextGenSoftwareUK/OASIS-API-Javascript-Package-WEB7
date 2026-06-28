# CollectiveConsciousness — `web7.collectiveConsciousness`

Source controller: [`CollectiveConsciousnessController.cs`](https://github.com/NextGenSoftwareUK/OASIS2/blob/main/WEB7/NextGenSoftware.OASIS.Web7.WebAPI/Controllers/CollectiveConsciousnessController.cs)
Route prefix: `v1/collective-consciousness`
3 operation(s).

All methods are generated 1:1 from the controller's real `[Http*]` routes (see
[Conventions](../README.md#calling-any-endpoint)). They take a single args
object: any key matching a `{token}` in the route is substituted into the
URL; everything else becomes the query string (GET/DELETE) or JSON body
(POST/PUT).

## Methods

| Method | HTTP | Route | Route params | Query params | Body |
| --- | --- | --- | --- | --- | --- |
| `createSpace` | POST | `v1/collective-consciousness/spaces` | – | `name` | remaining args |
| `getAggregateField` | GET | `v1/collective-consciousness/spaces/{spaceId}/field` | `spaceId` | – | – |
| `joinSpace` | POST | `v1/collective-consciousness/spaces/{spaceId}/join/{sessionId}` | `spaceId`, `sessionId` | – | remaining args |

## Example

```js
const web7 = new Web7Client({ baseUrl: '...' });
web7.setToken(jwtToken); // reuse a WEB4 JWT

const { isError, message, result } = await web7.collectiveConsciousness.createSpace({
    /* ...other fields per the request body */
  });
if (isError) throw new Error(message);
console.log(result);
```
