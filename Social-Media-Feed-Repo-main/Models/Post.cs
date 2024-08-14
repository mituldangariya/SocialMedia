using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SocialMediaApp.Models
{
    public class Post
    {
        public int PostId { get; set; }
        public Nullable<int> UserId { get; set; }
        public string PostContent { get; set; }
        public string PostPhoto { get; set; }
        public Nullable<System.DateTime> PostDate { get; set; }
        public Nullable<int> LikeCount { get; set; }
        public Nullable<int> CommentCount { get; set; }
        public Nullable<int> ShareCount { get; set; }
        public string Status { get; set; }

        // Add these properties
        public string ProfilePhoto { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
       // Add this property


        public virtual User UserData { get; set; }

        public string LikeType { get; set; }

        public virtual ICollection<Like> PostLikes { get; set; }
        public virtual ICollection<Comment> PostComments { get; set; }
    }
}