using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Text;
using System.Threading;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Http.Filters;
using SocialMediaApp.Controllers;
using SocialMediaApp.Methods;
namespace SocialMediaApp.BasicAuth
{
    public class BasicAuthenticationAttribute : AuthorizationFilterAttribute
    {

        public override void OnAuthorization(HttpActionContext actionContext)
        {
            // base.OnAuthorization(actionContext);
            if (actionContext.Request.Headers.Authorization == null)
            {
                actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Authorization is required.");
            }
            else
            {
                string authToken = actionContext.Request.Headers.Authorization.Parameter;

                string decodeAuthToken = Encoding.UTF8.GetString(Convert.FromBase64String(authToken));

                string[] usernamepassword = decodeAuthToken.Split(':');

                if (usernamepassword.Length != 2)
                {
                    actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Invalid token content");
                }
                else
                {

                    string username = usernamepassword[0];
                    string password = usernamepassword[1];

                    if (WebApiController.Login(username, password))
                    {
                        Thread.CurrentPrincipal = new GenericPrincipal(new GenericIdentity(username), null);
                    }
                    else
                    {
                        actionContext.Response = actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, "Login Failed");
                    }
                }
            }
        }
    }
}