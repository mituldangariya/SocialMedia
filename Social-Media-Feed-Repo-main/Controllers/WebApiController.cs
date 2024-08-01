using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Http;
using SocialMediaApp.Context;
using SocialMediaApp.Models;
using System.Net.Mail;


namespace SocialMediaApp.Controllers
{
    [RoutePrefix("api/WebApi")]
    public class WebApiController : ApiController
    {
        SocialMediaAppEntities db = new SocialMediaAppEntities();


       
        [HttpGet]
        [Route("GetUserData/{currentUserId}")]
        public IHttpActionResult GetUserData(int currentUserId)
        {
            try
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
                    RequestStatus = db.UserFriends.Where(f => (f.UserId == currentUserId && f.FollowerId == user.UserId) ||
                                                               (f.UserId == user.UserId && f.FollowerId == currentUserId))
                                  .Select(f => f.RequestStatus).FirstOrDefault(),
                    FollowerId = db.UserFriends.Where(f => (f.UserId == currentUserId && f.FollowerId == user.UserId) ||
                                                 (f.UserId == user.UserId && f.FollowerId == currentUserId))
                    .Select(f => f.FollowerId)
                    .FirstOrDefault()
                }).ToList();
                return Ok(usersNotFriends);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

       


        [HttpPost]
        [Route("uploadprofilephoto/{id}")]
        public IHttpActionResult UploadProfilePhoto(int id)
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;
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
                                command.Parameters.AddWithValue("@UserId", id);
                                command.Parameters.AddWithValue("@ProfilePhoto", profilePhotoUrl);

                                connection.Open();
                                int rowsAffected = command.ExecuteNonQuery();
                                if (rowsAffected > 0)
                                {
                                    return Ok(new { Message = "Profile photo updated successfully", ProfilePhoto = profilePhotoUrl });
                                }
                                else
                                {
                                    return BadRequest("Failed to update profile photo");
                                }
                            }
                        }
                    }
                }
                return BadRequest("No file uploaded or file is empty");
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }




        [HttpGet]
        [Route("UserProfile")]
        public IHttpActionResult GetUserProfile(int userId)
        {
            var user = db.GetUserById(userId);
            if (user == null)
            {
                return NotFound();
            }
            return Ok(user);
        }





        [HttpGet]
        [Route("Login")]
        public IHttpActionResult GetUser(string email, string password)
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

                            return Ok(userInfo);
                        }
                    }
                }
            }

            return Unauthorized();
        }




        [HttpGet]
        [Route("{id}")]
        public IHttpActionResult GetUserById(int id)
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
                                Posts = new List<Post>()
                            };

                            return Ok(userInfo);
                        }
                    }
                }
            }

            return Unauthorized();
        }




      
        [HttpPost]
        [Route("Register")]
        public IHttpActionResult AddUser(UserData user)
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
                return Ok(new { message = "Registration initiated. Please check your email for the OTP to complete registration." });
            }
            return Unauthorized();
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

        [HttpPost]
        [Route("VerifyOtp")]
        public IHttpActionResult VerifyOtp(string email, string otp)
        {
            var passwordResetEntry = db.PasswordResets.FirstOrDefault(pr => pr.Email == email && pr.Token == otp);
            if (passwordResetEntry == null)
            {
                return BadRequest("Invalid email or OTP.");
            }

            var timeDifference = (DateTime.UtcNow - passwordResetEntry.Created_At).TotalMinutes;
            if (timeDifference > 10)
            {
                return BadRequest("OTP has expired.");
            }
 
            var user = db.UserDatas.FirstOrDefault(u => u.Email == email);
            if (user != null)
            {
               
                db.SaveChanges();
            }

            return Ok(new { message = "OTP verified successfully. Registration complete." });
        }



        [HttpPut]
        [Route("{id}")]
        public IHttpActionResult UpdateUserInfo(int id, [FromBody] UserData user)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("UpdateUserInfo", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@UserId", id);
                    command.Parameters.AddWithValue("@FirstName", user.FirstName);
                    command.Parameters.AddWithValue("@LastName", user.LastName);
                    command.Parameters.AddWithValue("@City", user.City);
                    command.Parameters.AddWithValue("@UserPassword", user.UserPassword);
                    command.Parameters.AddWithValue("@Email", user.Email);
                    command.Parameters.AddWithValue("@Gender", user.Gender);
                    command.Parameters.AddWithValue("@Interests", user.Interests);
                    command.Parameters.AddWithValue("@PhoneNumber", user.PhoneNumber);
                    command.Parameters.AddWithValue("@Bio", user.Bio);

                    command.ExecuteNonQuery();

                    return Ok();
                }
            }
        }



        [HttpPost]
        [Route("CheckEmail")]
        public IHttpActionResult CheckEmail([FromBody] UserData request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.Email))
            {
                return BadRequest("Invalid email");
            }

            string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("CheckEmail", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserId", request.UserId);
                    command.Parameters.AddWithValue("@Email", request.Email);

                    connection.Open();
                    using (SqlDataReader reader = command.ExecuteReader())
                    {
                        if (reader.Read())
                        {
                            bool emailInUse = Convert.ToBoolean(reader["EmailInUse"]);
                            return Ok(new { emailInUse });
                        }
                        else
                        {
                            return InternalServerError(new Exception("No result returned from the stored procedure."));
                        }
                    }
                }
            }
        }


        

        [HttpPost]
        [Route("CheckPhoneNumber")]
        public IHttpActionResult CheckPhoneNumber([FromBody] UserData request)
        {
            if (request == null || string.IsNullOrWhiteSpace(request.PhoneNumber))
            {
                return BadRequest("Invalid phone number");
            }

            string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                using (SqlCommand command = new SqlCommand("CheckPhoneNumber", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;
                    command.Parameters.AddWithValue("@UserId", request.UserId);
                    command.Parameters.AddWithValue("@PhoneNumber", request.PhoneNumber);

                    try
                    {
                        connection.Open();
                        using (SqlDataReader reader = command.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                bool phoneInUse = Convert.ToBoolean(reader["PhoneInUse"]);
                                return Ok(new { phoneInUse });
                            }
                            else
                            {
                                return InternalServerError(new Exception("No result returned from the stored procedure."));
                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        
                        return InternalServerError(ex);
                    }
                }
            }
        }



        [HttpPost]
        [Route("NewPost")]
        public IHttpActionResult AddNewPost()
        {
            var httpRequest = HttpContext.Current.Request;
            var userId = httpRequest.Form["userId"];
            var postContent = httpRequest.Form["PostContent"];
            string mediaUrl = null;


            if (httpRequest.Files.Count > 0)
            {
                var postedFile = httpRequest.Files[0];
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
                        return BadRequest("Unsupported file type. Please upload images or videos.");
                    }
                }
            }


            UserPost post = new UserPost
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

            return Ok("Post added successfully.");
        }




        [HttpGet]
        [Route("GetLastPost")]
        public IHttpActionResult GetLastPost()
        {
            using (SocialMediaAppEntities post = new SocialMediaAppEntities())
            {

                SocialMediaAppEntities appEntities = new SocialMediaAppEntities();
                var data = appEntities.GetLastPost();
                return Ok(data);

            }
        }



 

        [HttpGet]
        [Route("UserPosts/{userId}")]
        public IHttpActionResult GetUserPosts(int userId)
        {
            try
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
                                .Where(post => (post.Status == null || post.Status == "2") &&
                                               friendIds.Contains(post.UserId))

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
                }).ToList();

                return Ok(formattedPostsInfo);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
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
                    // return postDate.Value.ToString("MMM dd, yyyy").ToLower();
                    return postDate.Value.ToString("MMM dd, yyyy");
                }
            }
            else
            {
                return string.Empty;
            }
        }



        [HttpPost]
        [Route("PostLike")]
        public IHttpActionResult LikePost([FromBody] PostLike request)
        {
            var post = db.UserPosts.Find(request.PostId);
            if (post == null)
            {
                return NotFound();
            }

            var userLike = db.PostLikes.FirstOrDefault(l => l.PostId == request.PostId && l.UserId == request.UserId);
            bool isLiked;

            if (userLike == null)
            {
                var like = new PostLike
                {
                    PostId = request.PostId,
                    UserId = request.UserId,
                    LikeDate = DateTime.Now
                };
                db.PostLikes.Add(like);
                post.LikeCount++;
                isLiked = true;
            }
            else
            {
                db.PostLikes.Remove(userLike);
                post.LikeCount--;
                isLiked = false;
            }

            db.SaveChanges();
            return Ok(new { likeCount = post.LikeCount, isLiked });
        }


       
        [HttpPost]
        [Route("AddComment")]
        public IHttpActionResult AddComment(PostComment model)
        {
            if (ModelState.IsValid)
            {
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

                var post = db.UserPosts.Find(comment.PostId);
                post.CommentCount++;
                db.SaveChanges();

                return Ok();
            }
            return BadRequest();
        }



       /* [HttpGet]
        [Route("GetLastComment")]
        public IHttpActionResult GetLastComment()
        {
            using (SocialMediaAppEntities context = new SocialMediaAppEntities())
            {
                var lastComment = context.PostComments
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

                if (lastComment == null)
                {
                    return NotFound();
                }

                return Ok(lastComment);
            }
        }*/




        [HttpPut]
        [Route("Deletepost/{id}")]
        public IHttpActionResult Deletepost(int id)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;

            using (SqlConnection connection = new SqlConnection(connectionString))
            {
                connection.Open();

                using (SqlCommand command = new SqlCommand("DeletePost", connection))
                {
                    command.CommandType = CommandType.StoredProcedure;

                    command.Parameters.AddWithValue("@Id", id);

                    command.ExecuteNonQuery();

                    return Ok();
                }
            }
        }



        [HttpGet]
        [Route("GetPostComments/{postId}")]
        public IHttpActionResult GetPostComments(int postId)
        {
            var comments = db.PostComments
                .Where(c => c.PostId == postId)
                .Select(c => new
                {
                    c.CommentId,
                    c.CommentText,
                    c.CommentDate,
                    c.UserId,
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
                c.ProfilePhoto
            }).ToList();

            return Ok(formattedComments);
        }



        private string FormatCommentDate(DateTime? commentDate)
        {
            if (commentDate == null)
            {
                return string.Empty;
            }

            TimeSpan timeSinceComment = DateTime.Now - commentDate.Value;
            if (timeSinceComment.TotalMinutes < 1)
            {
                return "Just now";
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
                return commentDate.Value.ToString("MM dd, yyyy");
            }
        }

        




        [HttpGet]
        [Route("GetCommentReplies/{parentCommentId}")]
        public IHttpActionResult GetCommentReplies(int parentCommentId)
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

            return Ok(replies);
        }






        [HttpDelete]
        [Route("DeleteComment/{commentId}")]
        public IHttpActionResult DeleteComment(int commentId)
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

                    return Ok();
                }
            }
        }


       
        [HttpGet]
        [Route("UserPosts1/{userId}")]
        public IHttpActionResult GetUserPosts1(int userId)
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
                PostDate = FormatPostDate(post.PostDate),
                LikeCount = post.LikeCount,
                ShareCount = post.ShareCount,
                CommentCount = post.CommentCount,
                FirstName = post.FirstName,
                LastName = post.LastName,
                ProfilePhoto = post.ProfilePhoto,
                LikeType = post.LikeType,
                Status = post.Status,
            }).ToList();

            return Ok(formattedPostsInfo);
        }




        [HttpPut]
        [Route("addarchievepost/{id}")]
        public IHttpActionResult AddArchievePost(int id)
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
                        return Ok();
                    }
                    catch (Exception ex)
                    {
                        return BadRequest("Error: " + ex.Message);
                    }
                }
            }
        }






        [HttpPut]
        [Route("removearchievepost/{id}")]
        public IHttpActionResult RemoveArchievePost(int id)
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
                        return Ok();
                    }
                    catch (Exception ex)
                    {
                        return BadRequest("Error: " + ex.Message);
                    }
                }
            }
        }





        [HttpGet]
        [Route("notifications/{userId}")]
        public IHttpActionResult GetUserNotifications(int userId)
        {
            string connectionString = ConfigurationManager.ConnectionStrings["SocialMediaAppADO"].ConnectionString;

            List<object> notifications = new List<object>();

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

            return Ok(notifications);
        }




      
        [HttpPost]
        [Route("AddFriend")]
        public IHttpActionResult AddFriend(UserFriend request)
        {
            int currentUserId = (int)request.FollowerId;
            if (request.UserId == currentUserId)
                return BadRequest("You cannot add yourself as a friend.");
            bool isFriendshipExisting = db.UserFriends
                .Any(f => (f.UserId == currentUserId && f.FollowerId == request.UserId) ||
                          (f.UserId == request.UserId && f.FollowerId == currentUserId));
            if (isFriendshipExisting)
                return BadRequest("Friendship already exists.");
            UserFriend newFriendship = new UserFriend
            {
                UserId = currentUserId,
                FollowerId = request.UserId,
                IsFriend = 1,
                RequestStatus = "pending"
            };
            db.UserFriends.Add(newFriendship);
            db.SaveChanges();
            return Ok();
        }




        [HttpPost]
        [Route("RemoveFriend")]
        public IHttpActionResult RemoveFriend(UserFriend request)
        {
            int currentUserId = (int)request.UserId;
            int friendId = (int)request.FollowerId;
            var existingFriendship = db.UserFriends
                .FirstOrDefault(f => (f.UserId == currentUserId && f.FollowerId == friendId) ||
                                      (f.UserId == friendId && f.FollowerId == currentUserId));
            if (existingFriendship == null)
                return BadRequest("Friendship does not exist.");
            db.UserFriends.Remove(existingFriendship);
            db.SaveChanges();
            return Ok();
        }




        [HttpPost]
        [Route("ConfirmFriendRequest")]
        public IHttpActionResult ConfirmFriendRequest(UserFriend request)
        {
            int currentUserId = (int)request.UserId;
            int friendId = (int)request.FollowerId;
            var friendRequest = db.UserFriends.FirstOrDefault(f => (f.UserId == currentUserId && f.FollowerId == friendId) ||
                                                                   (f.UserId == friendId && f.FollowerId == currentUserId));
            if (friendRequest != null)
            {
                friendRequest.RequestStatus = "accepted";
                friendRequest.IsFriend = 2;
                db.SaveChanges();
                return Ok();
            }
            else
            {
                return BadRequest("Friend request not found.");
            }
        }





        [HttpPost]
        [Route("Forgotpassword")]
        public IHttpActionResult ForgotPassword([FromBody] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required.");
            }

            var user = db.UserDatas.FirstOrDefault(u => u.Email == email);
            if (user == null)
            {
                return NotFound();
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

            return Ok();
        }


       
        private void SendResetPasswordEmail(string email, string token)
        {
            try
            {
                string encodedToken = System.Web.HttpUtility.UrlEncode(token);
                DateTime createdAtTime = GetCreatedAtTimeFromDatabase();
                DateTime expirationTime = createdAtTime.AddMinutes(10);

                string ResetPasswordLink = $"Dear User,\n\nPlease click the following link to reset your password:\n\nhttps://localhost:44321/Login/ResetPassword?token={encodedToken}\n\nNote: This link will expire at {expirationTime}.";

                using (MailMessage mail = new MailMessage())
                {
                    mail.From = new MailAddress("testdemo3101@gmail.com");
                    mail.To.Add(email);
                    mail.Subject = "Reset Password Link";
                    mail.Body = $"{ResetPasswordLink}";

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



        public bool IsTokenExpired(string token)
        {
            DateTime expirationTime = GetExpirationTimeFromToken(token);
            return DateTime.UtcNow > expirationTime;
        }

        private DateTime GetExpirationTimeFromToken(string token)
        {

            return DateTime.Now.AddMinutes(10);
        }



        [HttpGet]
        [Route("Resetpassword")]
        public IHttpActionResult ResetPassword(string token, string password)
        {
            var passwordReset = db.PasswordResets.SingleOrDefault(r => r.Token == token);
            if (passwordReset == null)
            {
                return BadRequest("Your Token Is Invalid");
            }
            if ((DateTime.UtcNow - passwordReset.Created_At).TotalMinutes > 10)
            {
                return BadRequest("This Token Has Expired. Please send a new password reset link.");
            }

            var user = db.UserDatas.SingleOrDefault(u => u.Email == passwordReset.Email);
            if (user == null)
            {
                return BadRequest("This Username Is Not Found.");
            }

            var lastThreePasswords = db.PasswordChangeHistories
                .Where(p => p.UserId == user.UserId)
                .OrderByDescending(p => p.ChangeDate)
                .Take(3)
                .Select(p => p.NewPassword)
                .ToList();

            if (lastThreePasswords.Contains(password))
            {
                return BadRequest("New password cannot be the same as any of the last three passwords.");
            }


            user.UserPassword = password;

            var passwordChange = new PasswordChangeHistory
            {
                UserId = user.UserId,
                NewPassword = password,
                ChangeDate = DateTime.Now
            };
            db.PasswordChangeHistories.Add(passwordChange);

            db.PasswordResets.Remove(passwordReset);
            db.SaveChanges();

            return Ok(new { Result = "Password has been updated successfully." });
        }




        [HttpGet]
        [Route("CheckTokenExpiration")]
        public IHttpActionResult CheckTokenExpiration(string token)
        {
            if (string.IsNullOrEmpty(token))
            {
                return BadRequest("Token is required.");
            }

            var passwordResetEntry = db.PasswordResets
                .Where(pr => pr.Token == token)
                .FirstOrDefault();

            if (passwordResetEntry == null)
            {
                return BadRequest(" This Token is invalid.");
            }

            var tokenCreationTime = passwordResetEntry.Created_At;
            var currentTime = DateTime.UtcNow;
            var timeDifference = (currentTime - tokenCreationTime).TotalMinutes;

            if (timeDifference > 10)
            {
                return BadRequest(" This Token has expired.");
            }

            return Ok(new { creationTime = tokenCreationTime });
        }



    }
}











