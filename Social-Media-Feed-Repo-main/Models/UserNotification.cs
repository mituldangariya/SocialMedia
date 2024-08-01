using SocialMediaApp.Context;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialMediaApp.Models
{
    public partial class UserNotification
    {
        public int NotificationID { get; set; }
        public Nullable<int> UserID { get; set; }
        public string NotificationType { get; set; }
        public Nullable<int> NotificationSenderUserID { get; set; }
        public Nullable<int> NotificationPostID { get; set; }
        public string NotificationText { get; set; }
        public Nullable<System.DateTime> NotificationTimestamp { get; set; }
        public string NotificationStatus { get; set; }

        public virtual UserData UserData { get; set; }
        public virtual UserData UserData1 { get; set; }
    }
}