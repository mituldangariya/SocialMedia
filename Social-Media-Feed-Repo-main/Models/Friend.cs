using SocialMediaApp.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialMediaApp.Models
{
    public partial class Friend
    {
        public int Id { get; set; }
        public Nullable<int> UserId { get; set; }
        public Nullable<int> FollowerId { get; set; }
        public Nullable<int> IsFriend { get; set; }
        public string RequestStatus { get; set; }

        public virtual UserData UserData { get; set; }
        public virtual UserData UserData1 { get; set; }
    }
}