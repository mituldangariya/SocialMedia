using Newtonsoft.Json.Linq;
using SocialMediaApp.Context;
using SocialMediaApp.Models;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;// For LINQ methods
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using System.Data.Entity; // For Include

using System.Net.Mail;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;

namespace SocialMediaApp.Methods
{
    public class WebApiMethods : ApiController
    {
        SocialMediaAppEntities db = new SocialMediaAppEntities();


        public object GetUserData(int currentUserId)
        {
            var usersNotFriends = db.UserDatas
                .Where(u => u.UserId != currentUserId)
                .Select(user => new
                {

                    UserId = user.UserId,
                    LastName = user.LastName,
                    FirstName = user.FirstName,
                    ProfilePhoto = user.ProfilePhoto,
                    IsFriend = db.UserFriends.Any(f => (f.UserId == currentUserId && f.FollowerId == user.UserId) ||
                                                       (f.UserId == user.UserId && f.FollowerId == currentUserId)),
                    RequestStatus = db.UserFriends
                        .Where(f => (f.UserId == currentUserId && f.FollowerId == user.UserId) ||
                                    (f.UserId == user.UserId && f.FollowerId == currentUserId))
                        .Select(f => f.RequestStatus)
                        .FirstOrDefault(),
                    FollowerId = db.UserFriends
                        .Where(f => (f.UserId == currentUserId && f.FollowerId == user.UserId) ||
                                    (f.UserId == user.UserId && f.FollowerId == currentUserId))
                        .Select(f => f.FollowerId)
                        .FirstOrDefault()
                }).ToList();

            return usersNotFriends;
        }

        public object UploadProfilePhoto(int userId, HttpRequest httpRequest)
        {
            if (httpRequest.Files.Count > 0)
            {
                var postedFile = httpRequest.Files[0];
                if (postedFile != null && postedFile.ContentLength > 0)
                {
                    var fileName = Path.GetFileName(postedFile.FileName);
                    var filePath = Path.Combine(HttpContext.Current.Server.MapPath("~/postupload/"), fileName);
                    postedFile.SaveAs(filePath);
                    var profilePhotoUrl = "/postupload/" + fileName;

                    string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;

                    using (SqlConnection connection = new SqlConnection(connectionString))
                    {
                        using (SqlCommand command = new SqlCommand("UpdateUserProfilePhoto", connection))
                        {
                            command.CommandType = CommandType.StoredProcedure;
                            command.Parameters.AddWithValue("@UserId", userId);
                            command.Parameters.AddWithValue("@ProfilePhoto", profilePhotoUrl);

                            connection.Open();
                            int rowsAffected = command.ExecuteNonQuery();
                            if (rowsAffected > 0)
                            {
                                return new { Message = "Profile photo updated successfully", ProfilePhoto = profilePhotoUrl };
                            }
                            else
                            {
                                throw new Exception("Failed to update profile photo");
                            }
                        }
                    }
                }
            }
            throw new Exception("No file uploaded or file is empty");
        }

        /* public User GetUser(string email, string password)
         {
             string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;

             using (SqlConnection connection = new SqlConnection(connectionString))
             {
                 connection.Open();

                 using (SqlCommand command = new SqlCommand("GetUser", connection))
                 {
                     command.CommandType = CommandType.StoredProcedure;

                     command.Parameters.AddWithValue("@Email", email);
                     command.Parameters.AddWithValue("@Password", password);

                     using (SqlDataReader reader = command.ExecuteReader())
                     {
                         if (reader.Read())
                         {
                             var userInfo = new User
                             {
                                 UserId = reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
                                 LastName = reader.IsDBNull(1) ? string.Empty : reader.GetString(1),
                                 FirstName = reader.IsDBNull(2) ? string.Empty : reader.GetString(2),
                                 City = reader.IsDBNull(3) ? string.Empty : reader.GetString(3),
                                 Email = reader.IsDBNull(4) ? string.Empty : reader.GetString(4),
                                 UserPassword = reader.IsDBNull(5) ? string.Empty : reader.GetString(5),
                                 Gender = reader.IsDBNull(6) ? string.Empty : reader.GetString(6),
                                 ProfilePhoto = reader.IsDBNull(7) ? string.Empty : reader.GetString(7),
                                 Interests = reader.IsDBNull(8) ? string.Empty : reader.GetString(8),
                                 PhoneNumber = reader.IsDBNull(9) ? string.Empty : reader.GetString(9),
                                 Bio = reader.IsDBNull(10) ? string.Empty : reader.GetString(10)
                             };

                             return userInfo;
                         }
                     }
                 }
             }

             return null;
         }*/


        public static User GetUser(string email, string password)
        {
            // Ensure the password is hashed and stored securely in your database
            // You should also implement proper password validation
            string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("GetUser", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@Email", email);
                    command.Parameters.AddWithValue("@Password", password); // Ensure this password is hashed

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var userInfo = new User
                            {
                                UserId = reader.IsDBNull(0) ? 0 : reader.GetInt32(0),
                                LastName = reader.IsDBNull(1) ? string.Empty : reader.GetString(1),
                                FirstName = reader.IsDBNull(2) ? string.Empty : reader.GetString(2),
                                City = reader.IsDBNull(3) ? string.Empty : reader.GetString(3),
                                Email = reader.IsDBNull(4) ? string.Empty : reader.GetString(4),
                                UserPassword = reader.IsDBNull(5) ? string.Empty : reader.GetString(5),
                                Gender = reader.IsDBNull(6) ? string.Empty : reader.GetString(6),
                                ProfilePhoto = reader.IsDBNull(7) ? string.Empty : reader.GetString(7),
                                Interests = reader.IsDBNull(8) ? string.Empty : reader.GetString(8),
                                PhoneNumber = reader.IsDBNull(9) ? string.Empty : reader.GetString(9),
                                Bio = reader.IsDBNull(10) ? string.Empty : reader.GetString(10)
                            };

                            return userInfo;
                        }
                    }
                }
            }

            return null;
        }





        public User GetUserById(int id)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("GetUserById", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserId", id);

                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            var userInfo = new User
                            {
                                UserId = reader.IsDBNull(reader.GetOrdinal("UserId")) ? 0 : reader.GetInt32(reader.GetOrdinal("UserId")),
                                LastName = reader.IsDBNull(reader.GetOrdinal("LastName")) ? string.Empty : reader.GetString(reader.GetOrdinal("LastName")),
                                FirstName = reader.IsDBNull(reader.GetOrdinal("FirstName")) ? string.Empty : reader.GetString(reader.GetOrdinal("FirstName")),
                                City = reader.IsDBNull(reader.GetOrdinal("City")) ? string.Empty : reader.GetString(reader.GetOrdinal("City")),
                                Email = reader.IsDBNull(reader.GetOrdinal("Email")) ? string.Empty : reader.GetString(reader.GetOrdinal("Email")),
                                UserPassword = reader.IsDBNull(reader.GetOrdinal("UserPassword")) ? string.Empty : reader.GetString(reader.GetOrdinal("UserPassword")),
                                Gender = reader.IsDBNull(reader.GetOrdinal("Gender")) ? string.Empty : reader.GetString(reader.GetOrdinal("Gender")),
                                ProfilePhoto = reader.IsDBNull(reader.GetOrdinal("ProfilePhoto")) ? string.Empty : reader.GetString(reader.GetOrdinal("ProfilePhoto")),
                                Interests = reader.IsDBNull(reader.GetOrdinal("Interests")) ? string.Empty : reader.GetString(reader.GetOrdinal("Interests")),
                                PhoneNumber = reader.IsDBNull(reader.GetOrdinal("PhoneNumber")) ? string.Empty : reader.GetString(reader.GetOrdinal("PhoneNumber")),
                                Bio = reader.IsDBNull(reader.GetOrdinal("Bio")) ? string.Empty : reader.GetString(reader.GetOrdinal("Bio")),
                                Posts = new List<Post>() // Initialize an empty list if required
                            };

                            return userInfo;
                        }
                    }
                }
            }

            return null; // Returning null if user not found
        }

        public void AddUser(UserData user)
        {
            if (user.Email != null && user.UserPassword != null)
            {
                var otp = new Random().Next(100000, 999999).ToString();
                var passwordReset = new PasswordReset
                {
                    Email = user.Email,
                    Token = otp,
                    Created_At = DateTime.UtcNow
                };

                db.PasswordResets.Add(passwordReset);
                user.ProfilePhoto = "/postupload/profile.png";
                db.UserDatas.Add(user);
                db.SaveChanges();

                SendOtpEmail(user.Email, otp);
            }
            else
            {
                throw new ArgumentException("Email and password are required.");
            }
        }

        public void VerifyOtp(string email, string otp)
        {
            var passwordResetEntry = db.PasswordResets.FirstOrDefault(pr => pr.Email == email && pr.Token == otp);
            if (passwordResetEntry == null)
            {
                throw new ArgumentException("Invalid email or OTP.");
            }

            var timeDifference = (DateTime.UtcNow - passwordResetEntry.Created_At).TotalMinutes;
            if (timeDifference > 10)
            {
                throw new ArgumentException("OTP has expired.");
            }

            var user = db.UserDatas.FirstOrDefault(u => u.Email == email);
            if (user != null)
            {
                db.SaveChanges();
            }
            else
            {
                throw new ArgumentException("User not found.");
            }
        }

        private void SendOtpEmail(string email, string otp)
        {
            try
            {
                string emailBody = $"Dear User,\n\nYour OTP for registration is: {otp}\n\nNote: This OTP is valid for 10 minutes.";

                using (MailMessage mail = new MailMessage())
                {
                    mail.From = new MailAddress("testdemo3101@gmail.com");
                    mail.To.Add(email);
                    mail.Subject = "Registration OTP";
                    mail.Body = emailBody;

                    using (SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587))
                    {
                        smtp.Credentials = new System.Net.NetworkCredential("testdemo3101@gmail.com", "ldye iwbw nhui dncq");
                        smtp.EnableSsl = true;
                        smtp.Send(mail);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Failed to send OTP email: {e.Message}");
            }
        }
        public void UpdateUserInfo(int id, UserData user)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("UpdateUserInfo", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@UserId", id);
                    command.Parameters.AddWithValue("@FirstName", user.FirstName ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@LastName", user.LastName ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@City", user.City ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@UserPassword", user.UserPassword ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@Email", user.Email ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@Gender", user.Gender ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@Interests", user.Interests ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@PhoneNumber", user.PhoneNumber ?? (object)DBNull.Value);
                    command.Parameters.AddWithValue("@Bio", user.Bio ?? (object)DBNull.Value);

                    command.ExecuteNonQuery();
                }
            }
        }


        public bool CheckEmail(int userId, string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                throw new ArgumentException("Email cannot be null or empty", nameof(email));
            }

            string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("CheckEmail", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserId", userId);
                    command.Parameters.AddWithValue("@Email", email);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return Convert.ToBoolean(reader["EmailInUse"]);
                        }
                        else
                        {
                            throw new Exception("No result returned from the stored procedure.");
                        }
                    }
                }
            }
        }

        public bool CheckPhoneNumber(int userId, string phoneNumber)
        {
            if (string.IsNullOrWhiteSpace(phoneNumber))
            {
                throw new ArgumentException("Phone number cannot be null or empty", nameof(phoneNumber));
            }

            string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("CheckPhoneNumber", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserId", userId);
                    command.Parameters.AddWithValue("@PhoneNumber", phoneNumber);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            return Convert.ToBoolean(reader["PhoneInUse"]);
                        }
                        else
                        {
                            throw new Exception("No result returned from the stored procedure.");
                        }
                    }
                }
            }
        }



        public string AddNewPost(HttpRequest request)
        {
            var userId = request.Form["userId"];
            var postContent = request.Form["PostContent"];
            string mediaUrl = null;

            if (request.Files.Count > 0)
            {
                var postedFile = request.Files[0];
                if (postedFile != null && postedFile.ContentLength > 0)
                {
                    string fileType = Path.GetExtension(postedFile.FileName).ToLower();

                    if (fileType == ".jpg" || fileType == ".jpeg" || fileType == ".png" || fileType == ".gif")
                    {
                        // Image file
                        string fileName = Path.GetFileName(postedFile.FileName);
                        string imagePath = "~/images/" + fileName;
                        postedFile.SaveAs(HttpContext.Current.Server.MapPath(imagePath));
                        mediaUrl = VirtualPathUtility.ToAbsolute(imagePath);
                    }
                    else if (fileType == ".mp4" || fileType == ".avi" || fileType == ".mov" || fileType == ".wmv")
                    {
                        // Video file
                        string fileName = Path.GetFileName(postedFile.FileName);
                        string videoPath = "~/videos/" + fileName;
                        postedFile.SaveAs(HttpContext.Current.Server.MapPath(videoPath));
                        mediaUrl = VirtualPathUtility.ToAbsolute(videoPath);
                    }
                    else
                    {
                        throw new Exception("Unsupported file type. Please upload images or videos.");
                    }
                }
            }

            var post = new UserPost
            {
                UserId = Convert.ToInt32(userId),
                PostContent = postContent,
                PostPhoto = mediaUrl,
                PostDate = DateTime.Now,
                LikeCount = 0,
                ShareCount = 0,
                CommentCount = 0
            };

            db.UserPosts.Add(post);
            db.SaveChanges();

            return "Post added successfully.";
        }



        public List<object> GetUserPosts(int userId)
        {
            var friendIdsSentRequests = db.UserFriends
                .Where(f => f.FollowerId == userId && f.RequestStatus == "accepted")
                .Select(f => f.UserId)
                .ToList();

            var friendIdsReceivedRequests = db.UserFriends
                .Where(f => f.UserId == userId && f.RequestStatus == "accepted")
                .Select(f => f.FollowerId)
                .ToList();

            var friendIds = friendIdsSentRequests.Concat(friendIdsReceivedRequests).ToList();
            friendIds.Add(userId);

            var postsInfo = db.UserPosts
                 .Where(post => post.Status == null && friendIds.Contains(post.UserId))
                .OrderBy(post => post.PostDate)
                .Select(post => new
                {
                    PostId = post.PostId,
                    UserId = post.UserId,
                    PostContent = post.PostContent,
                    PostPhoto = post.PostPhoto,
                    PostDate = post.PostDate,
                    LikeCount = post.LikeCount,
                    ShareCount = post.ShareCount,
                    CommentCount = post.CommentCount,
                    FirstName = post.UserData.FirstName,
                    LastName = post.UserData.LastName,
                    ProfilePhoto = post.UserData.ProfilePhoto,
                    Status = post.Status,
                    IsLiked = post.PostLikes.Any(x => x.UserId == userId),
                    LikeType = post.PostLikes.Select(x => x.LikeType)
                })
                .ToList();

            var formattedPostsInfo = postsInfo.Select(post => new
            {
                PostId = post.PostId,
                UserId = post.UserId,
                PostContent = post.PostContent,
                PostPhoto = post.PostPhoto,
                PostDate = FormatPostDate(post.PostDate),
                LikeCount = post.LikeCount,
                ShareCount = post.ShareCount,
                CommentCount = post.CommentCount,
                FirstName = post.FirstName,
                LastName = post.LastName,
                ProfilePhoto = post.ProfilePhoto,
                LikeType = post.LikeType,
                IsLiked = post.IsLiked,
                Status = post.Status,
            }).Cast<object>().ToList();

            return formattedPostsInfo;
        }

        private string FormatPostDate(DateTime? postDate)
        {
            if (postDate.HasValue)
            {
                TimeSpan timeSincePost = DateTime.Now - postDate.Value;
                if (timeSincePost.TotalMinutes < 1)
                {
                    return "just now";
                }
                else if (timeSincePost.TotalHours < 1)
                {
                    return $"{(int)timeSincePost.TotalMinutes} min ago";
                }
                else if (timeSincePost.TotalDays < 1)
                {
                    return $"{(int)timeSincePost.TotalHours} h ago";
                }
                else if (timeSincePost.TotalDays < 30)
                {
                    return $"{(int)timeSincePost.TotalDays} d ago";
                }
                else
                {
                    return postDate.Value.ToString("MMM dd, yyyy");
                }
            }
            else
            {
                return string.Empty;
            }
        }




        public (int LikeCount, bool IsLiked) LikePost(int postId, int userId)
        {
            var post = db.UserPosts.Find(postId);
            if (post == null)
            {
                throw new InvalidOperationException("Post not found");
            }

            var userLike = db.PostLikes.FirstOrDefault(l => l.PostId == postId && l.UserId == userId);
            bool isLiked;

            // Handle the case where LikeCount might be null
            int likeCount = post.LikeCount ?? 0;

            if (userLike == null)
            {
                var like = new PostLike
                {
                    PostId = postId,
                    UserId = userId,
                    LikeDate = DateTime.Now
                };
                db.PostLikes.Add(like);
                likeCount++;
                isLiked = true;
            }
            else
            {
                db.PostLikes.Remove(userLike);
                likeCount--;
                isLiked = false;
            }

            // Update the LikeCount in the database
            post.LikeCount = likeCount;
            db.SaveChanges();

            return (likeCount, isLiked);
        }




        public object AddComment(PostComment model)
        {
            if (model == null)
            {
                throw new ArgumentNullException(nameof(model));
            }

            if (model.ParentCommentId.HasValue)
            {
                // Optionally validate that the parent comment exists
                var parentComment = db.PostComments.Find(model.ParentCommentId.Value);
                if (parentComment == null)
                {
                    throw new Exception("Parent comment not found.");
                }
            }

            var comment = new PostComment
            {
                PostId = model.PostId,
                UserId = model.UserId,
                CommentText = model.CommentText,
                CommentDate = DateTime.Now,
                ParentCommentId = model.ParentCommentId,
                IsDeleted = 0
            };

            db.PostComments.Add(comment);
            db.SaveChanges();

            if (comment.CommentId == 0)
            {
                throw new Exception("Failed to save comment.");
            }

            var user = db.UserDatas.Find(comment.UserId);
            if (user == null)
            {
                throw new Exception("User not found.");
            }

            var post = db.UserPosts.Find(comment.PostId);
            if (post != null)
            {
                post.CommentCount++;
                db.SaveChanges();
            }

            var response = new
            {
                CommentId = comment.CommentId,
                CommentText = comment.CommentText,
                CommentDate = DateTime.Now,
                UserName = user.FirstName + " " + user.LastName,
                ProfilePhoto = user.ProfilePhoto
            };

            return response;
        }



        public object GetLastComment()
        {
            var lastComment = db.PostComments
                .Include(pc => pc.UserData)
                .OrderByDescending(pc => pc.CommentId)
                .Select(pc => new
                {
                    pc.CommentId,
                    pc.UserId,
                    pc.CommentText,
                    ProfilePhoto = pc.UserData.ProfilePhoto,
                    FirstName = pc.UserData.FirstName,
                    LastName = pc.UserData.LastName
                })
                .FirstOrDefault();

            return lastComment;
        }


        public void DeletePost(int id)
        {
            // Retrieve connection string
            string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("DeletePost", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Id", id);
                    command.ExecuteNonQuery();
                }
            }
        }

        public object GetPostComments(int postId)
        {
            var comments = db.PostComments
               .Where(c => c.PostId == postId && c.IsDeleted == 0)
                .Select(c => new
                {
                    c.CommentId,
                    c.CommentText,
                    c.CommentDate,
                    c.UserId,
                    c.ParentCommentId,
                    UserName = c.UserData.FirstName + " " + c.UserData.LastName,
                    ProfilePhoto = c.UserData.ProfilePhoto
                })
                .ToList();

            var formattedComments = comments.Select(c => new
            {
                c.CommentId,
                c.CommentText,
                CommentDate = FormatCommentDate(c.CommentDate),
                c.UserName,
                c.UserId,
                c.ParentCommentId,
                c.ProfilePhoto
            }).ToList();

            return formattedComments;
        }

        private string FormatCommentDate(DateTime? commentDate)
        {
            if (commentDate.HasValue)
            {
                TimeSpan timeSinceComment = DateTime.Now - commentDate.Value;
                if (timeSinceComment.TotalMinutes < 1)
                {
                    return "just now";
                }
                else if (timeSinceComment.TotalHours < 1)
                {
                    return $"{(int)timeSinceComment.TotalMinutes} min ago";
                }
                else if (timeSinceComment.TotalDays < 1)
                {
                    return $"{(int)timeSinceComment.TotalHours} h ago";
                }
                else if (timeSinceComment.TotalDays < 30)
                {
                    return $"{(int)timeSinceComment.TotalDays} d ago";
                }
                else
                {
                    return commentDate.Value.ToString("MMM dd, yyyy");
                }
            }
            else
            {
                return string.Empty;
            }
        }

        public object GetCommentReplies(int parentCommentId)
        {
            var replies = db.PostComments
                .Where(c => c.ParentCommentId == parentCommentId)
                .Select(c => new
                {
                    c.CommentId,
                    c.CommentText,
                    c.CommentDate,
                    c.UserId,
                    UserName = c.UserData.FirstName + " " + c.UserData.LastName,
                    ProfilePhoto = c.UserData.ProfilePhoto,
                    ParentCommentId = c.ParentCommentId
                })
                .ToList();

            return replies;
        }


        public void DeleteComment(int commentId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("DeleteComment", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@commentId", commentId);

                    command.ExecuteNonQuery();
                }
            }
        }


        public List<dynamic> GetUserPosts1(int userId)
        {
            var postsInfo = db.UserPosts
                .Where(post => post.Status == null || post.Status == "2")
                .OrderBy(post => post.PostDate)
                .Select(post => new
                {
                    PostId = post.PostId,
                    UserId = post.UserId,
                    PostContent = post.PostContent,
                    PostPhoto = post.PostPhoto,
                    PostDate = post.PostDate,
                    LikeCount = post.LikeCount,
                    ShareCount = post.ShareCount,
                    CommentCount = post.CommentCount,
                    FirstName = post.UserData.FirstName,
                    LastName = post.UserData.LastName,
                    ProfilePhoto = post.UserData.ProfilePhoto,
                    Status = post.Status,
                    LikeType = post.PostLikes.Select(x => x.LikeType)
                }).ToList();

            var formattedPostsInfo = postsInfo.Select(post => new
            {
                PostId = post.PostId,
                UserId = post.UserId,
                PostContent = post.PostContent,
                PostPhoto = post.PostPhoto,
                PostDate = post.PostDate.HasValue ? FormatPostDate(post.PostDate.Value) : null,
                LikeCount = post.LikeCount,
                ShareCount = post.ShareCount,
                CommentCount = post.CommentCount,
                FirstName = post.FirstName,
                LastName = post.LastName,
                ProfilePhoto = post.ProfilePhoto,
                LikeType = post.LikeType,
                Status = post.Status,
            }).ToList<dynamic>();

            return formattedPostsInfo;
        }

        private string FormatPostDate(DateTime postDate)
        {
            // Implement your date formatting logic here
            return postDate.ToString("yyyy-MM-dd"); // Example format
        }



        public void AddArchievePost(int id)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("AddArchievePost", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Id", id);

                    try
                    {
                        command.ExecuteNonQuery();
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Error: " + ex.Message);
                    }
                }
            }
        }

        public void RemoveArchievePost(int id)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("RemoveArchievePost", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@Id", id);

                    try
                    {
                        connection.Open();
                        command.ExecuteNonQuery();
                    }
                    catch (Exception ex)
                    {
                        throw new Exception("Error: " + ex.Message);
                    }
                }
            }
        }



/*        public IEnumerable<Post> GetLastPost()
        {
            string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;

            var posts = new List<Post>();

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("GetLastPost", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    try
                    {
                        connection.Open();
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                var post = new Post
                                {
                                    PostId = reader.GetInt32(reader.GetOrdinal("PostId")),
                                    UserId = reader.IsDBNull(reader.GetOrdinal("UserId")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("UserId")),
                                    PostContent = reader.GetString(reader.GetOrdinal("PostContent")),
                                    PostPhoto = reader.GetString(reader.GetOrdinal("PostPhoto")),
                                    PostDate = reader.IsDBNull(reader.GetOrdinal("PostDate")) ? (DateTime?)null : reader.GetDateTime(reader.GetOrdinal("PostDate")),
                                    LikeCount = reader.IsDBNull(reader.GetOrdinal("LikeCount")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("LikeCount")),
                                    ShareCount = reader.IsDBNull(reader.GetOrdinal("ShareCount")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("ShareCount")),
                                    CommentCount = reader.IsDBNull(reader.GetOrdinal("CommentCount")) ? (int?)null : reader.GetInt32(reader.GetOrdinal("CommentCount")),
                                    ProfilePhoto = reader.GetString(reader.GetOrdinal("ProfilePhoto")),
                                    LastName = reader.GetString(reader.GetOrdinal("LastName")),
                                    FirstName = reader.GetString(reader.GetOrdinal("FirstName"))
                                };
                                posts.Add(post);
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        // Handle exceptions as needed
                        throw;
                    }
                }
            }

            return posts;
        }
*/


        public List<object> GetUserNotifications(int userId)
        {
            List<object> notifications = new List<object>();

            string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;
            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("GetUserNotifications", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@userId", userId);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            var notification = new
                            {
                                NotificationText = reader["NotificationText"].ToString(),
                                NotificationTimestamp = (DateTime)reader["NotificationTimestamp"],
                                PostId = reader["PostId"],
                                PostPhoto = reader["PostPhoto"],
                                PostContent = reader["PostContent"],
                                ProfilePhoto = reader["ProfilePhoto"]
                            };

                            notifications.Add(notification);
                        }
                    }
                }
            }

            return notifications;
        }

        public void AddFriend(int currentUserId, int friendUserId)
        {
            if (currentUserId == friendUserId)
                throw new ArgumentException("You cannot add yourself as a friend.");

            bool isFriendshipExisting = db.UserFriends
                .Any(f => (f.UserId == currentUserId && f.FollowerId == friendUserId) ||
                          (f.UserId == friendUserId && f.FollowerId == currentUserId));

            if (isFriendshipExisting)
                throw new InvalidOperationException("Friendship already exists.");

            UserFriend newFriendship = new UserFriend
            {
                UserId = currentUserId,
                FollowerId = friendUserId,
                IsFriend = 1,
                RequestStatus = "pending"
            };

            db.UserFriends.Add(newFriendship);
            db.SaveChanges();
        }

        public void RemoveFriend(int currentUserId, int friendId)
        {
            var existingFriendship = db.UserFriends
                .FirstOrDefault(f => (f.UserId == currentUserId && f.FollowerId == friendId) ||
                                      (f.UserId == friendId && f.FollowerId == currentUserId));
            if (existingFriendship == null)
                throw new InvalidOperationException("Friendship does not exist.");

            db.UserFriends.Remove(existingFriendship);
            db.SaveChanges();
        }

        public void ConfirmFriendRequest(int userId, int followerId)
        {
            var friendRequest = db.UserFriends
                .FirstOrDefault(f => (f.UserId == userId && f.FollowerId == followerId) ||
                                      (f.UserId == followerId && f.FollowerId == userId));
            if (friendRequest == null)
                throw new InvalidOperationException("Friend request not found.");

            friendRequest.RequestStatus = "accepted";
            friendRequest.IsFriend = 2;
            db.SaveChanges();
        }

        public void HandleForgotPassword(string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                throw new ArgumentException("Email is required.");
            }

            var user = db.UserDatas.FirstOrDefault(u => u.Email == email);
            if (user == null)
            {
                throw new InvalidOperationException("User not found.");
            }

            var token = Guid.NewGuid().ToString();
            var passwordReset = new PasswordReset
            {
                Email = email,
                Token = token,
                Created_At = DateTime.Now
            };
            db.PasswordResets.Add(passwordReset);
            db.SaveChanges();

            SendResetPasswordEmail(email, token);
        }

        private void SendResetPasswordEmail(string email, string token)
        {
            try
            {
                // Encode the reset token
                string encodedToken = System.Web.HttpUtility.UrlEncode(token);

                DateTime createdAtTime = GetCreatedAtTimeFromDatabase();
                // Calculate expiration time (10 minutes from now)
                DateTime expirationTime = DateTime.Now.AddMinutes(10);

                // Compose the reset password link
                string resetPasswordLink = $"Dear User,\n\nPlease click the following link to reset your password:\n\nhttps://localhost:44321/Login/ResetPassword?token={encodedToken}\n\nNote: This link will expire at {expirationTime}.";

                // Create and configure the email message
                using (MailMessage mail = new MailMessage())
                {
                    mail.From = new MailAddress("testdemo3101@gmail.com");
                    mail.To.Add(email);
                    mail.Subject = "Reset Password Link";
                    mail.Body = resetPasswordLink;

                    // Configure and send the email using SMTP
                    using (SmtpClient smtp = new SmtpClient("smtp.gmail.com", 587))
                    {
                        smtp.Credentials = new System.Net.NetworkCredential("testdemo3101@gmail.com", "ldye iwbw nhui dncq");
                        smtp.EnableSsl = true;
                        smtp.Send(mail);
                    }
                }
            }
            catch (Exception e)
            {
                Console.WriteLine($"Failed to send mail: {e.Message}");
            }
        }
        private DateTime GetCreatedAtTimeFromDatabase()
        {

            return DateTime.Now;
        }


        // Checks if the token is expired based on its expiration time
        public bool IsTokenExpired(string token)
        {
            DateTime expirationTime = GetExpirationTimeFromToken(token);
            return DateTime.UtcNow > expirationTime;
        }

        // Calculates the expiration time based on the token's creation time
        private DateTime GetExpirationTimeFromToken(string token)
        {

            return DateTime.Now.AddMinutes(10);
        }



        public void ResetUserPassword(string token, string newPassword)
        {
            var passwordReset = db.PasswordResets.SingleOrDefault(r => r.Token == token);
            if (passwordReset == null)
            {
                throw new ArgumentException("Your Token Is Invalid");
            }
            if ((DateTime.UtcNow - passwordReset.Created_At).TotalMinutes > 10)
            {
                throw new ArgumentException("This Token Has Expired. Please send a new password reset link.");
            }

            var user = db.UserDatas.SingleOrDefault(u => u.Email == passwordReset.Email);
            if (user == null)
            {
                throw new ArgumentException("This Username Is Not Found.");
            }

            var lastThreePasswords = db.PasswordChangeHistories
                .Where(p => p.UserId == user.UserId)
                .OrderByDescending(p => p.ChangeDate)
                .Take(3)
                .Select(p => p.NewPassword)
                .ToList();

            if (lastThreePasswords.Contains(newPassword))
            {
                throw new ArgumentException("New password cannot be the same as any of the last three passwords.");
            }

            user.UserPassword = newPassword;

            var passwordChange = new PasswordChangeHistory
            {
                UserId = user.UserId,
                NewPassword = newPassword,
                ChangeDate = DateTime.Now
            };
            db.PasswordChangeHistories.Add(passwordChange);

            db.PasswordResets.Remove(passwordReset);
            db.SaveChanges();
        }

        public DateTime CheckTokenExpiration(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                throw new ArgumentException("Token is required.");
            }

            var passwordResetEntry = db.PasswordResets
                .Where(pr => pr.Token == token)
                .FirstOrDefault();

            if (passwordResetEntry == null)
            {
                throw new ArgumentException("This Token is invalid.");
            }

            var tokenCreationTime = passwordResetEntry.Created_At;
            var currentTime = DateTime.UtcNow;
            var timeDifference = (currentTime - tokenCreationTime).TotalMinutes;

            if (timeDifference > 10)
            {
                throw new ArgumentException("This Token has expired.");
            }

            return tokenCreationTime;
        }
    }
}