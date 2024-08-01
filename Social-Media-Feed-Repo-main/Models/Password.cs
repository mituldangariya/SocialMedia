using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialMediaApp.Models
{
    public partial class Password
    {
        public int PasswordId { get; set; }
        public string Email { get; set; }
        public string Token { get; set; }
        public System.DateTime Created_At { get; set; }
    }
}