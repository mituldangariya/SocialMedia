using Microsoft.Owin;
using Microsoft.Owin.Security;
using Microsoft.Owin.Security.Jwt;
using Owin;
using System.Configuration;
using System.Text;
using Microsoft.IdentityModel.Tokens;

[assembly: OwinStartup(typeof(SocialMediaApp.App_Start.Startup))]

namespace SocialMediaApp.App_Start
{
    public class Startup
    {
        /* public void Configuration(IAppBuilder app)
         {
             app.Use(async (context, next) =>
             {
                 if (context.Request.Headers["Authorization"] != null)
                 {
                     // Add your authentication logic here
                 }
                 await next.Invoke();
             });


         }*/
        public void Configuration(IAppBuilder app)
        {
            var key = Encoding.ASCII.GetBytes(ConfigurationManager.AppSettings["JwtSecretKey"]); // Use a secure key from web.config

            app.UseJwtBearerAuthentication(new JwtBearerAuthenticationOptions
            {
                AuthenticationMode = AuthenticationMode.Active,
                TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = "YourIssuer",
                    ValidAudience = "YourAudience",
                    IssuerSigningKey = new SymmetricSecurityKey(key)
                }
            });
        }
    }
}
