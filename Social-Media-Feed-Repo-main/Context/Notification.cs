//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace SocialMediaApp.Context
{
    using System;
    using System.Collections.Generic;
    
    public partial class Notification
    {
        public int NotificationID { get; set; }
        public Nullable<int> UserID { get; set; }
        public string NotificationType { get; set; }
        public Nullable<int> NotificationSenderUserID { get; set; }
        public Nullable<int> NotificationPostID { get; set; }
        public string NotificationText { get; set; }
        public Nullable<System.DateTime> NotificationTimestamp { get; set; }
        public string NotificationStatus { get; set; }
        public string PostPhoto { get; set; }
        public Nullable<int> PostId { get; set; }
        public string PostContent { get; set; }
        public string ProfilePhoto { get; set; }
    
        public virtual UserData UserData { get; set; }
        public virtual UserData UserData1 { get; set; }
        public virtual UserPost UserPost { get; set; }
    }
}
