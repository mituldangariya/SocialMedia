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
using System.Data.Entity;
using SocialMediaApp.Methods;
using Newtonsoft.Json.Linq;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Web.Security;
using SocialMediaApp.BasicAuth;

namespace SocialMediaApp.Controllers
{
    [RoutePrefix("api/WebApi")]
    public class WebApiController : ApiController
    {
        SocialMediaAppEntities db = new SocialMediaAppEntities();


          WebApiMethods methods = new WebApiMethods();


        /// <summary>
        /// Retrieves a list of users who are not friends with the current user, including their profile information and friendship status.
        /// </summary>
        /// <param name="currentUserId">The ID of the current user.</param>
        /// <returns>A list of users not friends with the current user, with details on friendship status and request status.</returns>
        /// 
        [BasicAuthentication]
        [HttpGet]
        [Route("GetUserData/{currentUserId}")]
        public IHttpActionResult GetUserData(int currentUserId)
        {
            try
            {
                var usersNotFriends = methods.GetUserData(currentUserId);
                return Ok(usersNotFriends);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        /// <summary>
        /// Uploads a profile photo for the user and updates the profile photo URL in the database.
        /// </summary>
        /// <param name="id">The ID of the user whose profile photo is being updated.</param>
        /// <returns>An HTTP response indicating the result of the operation.</returns>

        [BasicAuthentication]
        [HttpPost]
        [Route("uploadprofilephoto/{id}")]
        public IHttpActionResult UploadProfilePhoto(int id)
        {
            try
            {
                var httpRequest = HttpContext.Current.Request;
                var result = methods.UploadProfilePhoto(id, httpRequest);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }
     



        /// <summary>
        /// Retrieves the profile information for the specified user.
        /// </summary>
        /// <param name="userId">The ID of the user whose profile is being retrieved.</param>
        /// <returns>An HTTP response containing the user profile data or a 404 Not Found status if the user does not exist.</returns>

        
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




        /// <summary>
        /// Retrieves user details based on the provided email and password.
        /// </summary>
        /// <param name="email">The email address of the user.</param>
        /// <param name="password">The password of the user.</param>
        /// <returns>Returns an HTTP response with user information if credentials are valid, otherwise returns Unauthorized.</returns>

        [AllowAnonymous]
        [HttpGet]
        [Route("Login")]
        public IHttpActionResult GetUser(string email, string password)
        {
            try
            {
                var user = WebApiMethods.GetUser(email, password);
                if (user == null)
                {
                    return Unauthorized();
                }
                // FormsAuthentication.SetAuthCookie(email, false);
                var authToken = Convert.ToBase64String(Encoding.UTF8.GetBytes($"{email}:{password}"));

                //return Ok(user);
                var response = new
                {
                    User = user,
                    Token = authToken
                };
                return Ok(response);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        public static bool Login(string email,string password)
        {
            try
            {
                var user = WebApiMethods.GetUser(email, password);
                if (user != null)
                {
                    return  true;
                }
                else
                {
                    return false;
                }
                
            }
            catch (Exception ex)
            {
                return false;
            }
        }

       

        /// <summary>
        /// Retrieves user details based on the specified user ID.
        /// </summary>
        /// <param name="id">The ID of the user to retrieve.</param>
        /// <returns>An IHttpActionResult containing the user details or an error response if the user is not found.</returns>


        
        [HttpGet]
        [Route("{id}")]
        public IHttpActionResult GetUserById(int id)
        {
            try
            {
                var user = methods.GetUserById(id);
                if (user == null)
                {
                    return NotFound();
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        /// <summary>
        /// Registers a new user and initiates OTP-based email verification.
        /// </summary>
        /// <param name="user">The user data for registration.</param>
        /// <returns>An IHttpActionResult indicating the result of the registration process.</returns>

        [AllowAnonymous]
        [HttpPost]
        [Route("Register")]
        public IHttpActionResult AddUser(UserData user)
        {
            try
            {
                methods.AddUser(user);
                return Ok(new { message = "Registration initiated. Please check your email for the OTP to complete registration." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

       
        [HttpPost]
        [Route("VerifyOtp")]
        public IHttpActionResult VerifyOtp(string email, string otp)
        {
            try
            {
                methods.VerifyOtp(email, otp);
                return Ok(new { message = "OTP verified successfully. Registration complete." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        /// <summary>
        /// Updates user information based on the provided user ID.
        /// </summary>
        /// <param name="id">The ID of the user to update.</param>
        /// <param name="user">The user data with updated information.</param>
        /// <returns>An IHttpActionResult indicating the result of the update operation.</returns>

        [BasicAuthentication]
        [HttpPut]
        [Route("{id}")]
        public IHttpActionResult UpdateUserInfo(int id, [FromBody] UserData user)
        {
            try
            {
                methods.UpdateUserInfo(id, user);
                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        /// <summary>
        /// Checks if the provided email is already in use by a user.
        /// </summary>
        /// <param name="request">An object containing the user ID and email to check.</param>
        /// <returns>An IHttpActionResult indicating whether the email is in use or not.</returns>


        [BasicAuthentication]
        [HttpPost]
        [Route("CheckEmail")]
        public IHttpActionResult CheckEmail([FromBody] UserData request)
        {
            try
            {
                if (request == null || string.IsNullOrWhiteSpace(request.Email))
                {
                    return BadRequest("Invalid email");
                }

                bool emailInUse = methods.CheckEmail(request.UserId, request.Email);
                return Ok(new { emailInUse });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        /// <summary>
        /// Checks if the provided phone number is already in use by a user.
        /// </summary>
        /// <param name="request">An object containing the user ID and phone number to check.</param>
        /// <returns>An IHttpActionResult indicating whether the phone number is in use or not.</returns>

        [BasicAuthentication]
        [HttpPost]
        [Route("CheckPhoneNumber")]
        public IHttpActionResult CheckPhoneNumber([FromBody] UserData request)
        {
            try
            {
                if (request == null || string.IsNullOrWhiteSpace(request.PhoneNumber))
                {
                    return BadRequest("Invalid phone number");
                }

                bool phoneInUse = methods.CheckPhoneNumber(request.UserId, request.PhoneNumber);
                return Ok(new { phoneInUse });
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        /// <summary>
        /// Adds a new post with optional media to the user's feed.
        /// </summary>
        /// <returns>An IHttpActionResult indicating the result of the post operation.</returns>

        [BasicAuthentication]
        [HttpPost]
        [Route("NewPost")]
        public IHttpActionResult AddNewPost()
        {
            try
            {
                var result = methods.AddNewPost(HttpContext.Current.Request);
                return Ok(result);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }




        /// <summary>
        /// Retrieves the most recent post from the database.
        /// </summary>
        /// <returns>An IHttpActionResult containing the most recent post.</returns>

        [BasicAuthentication]
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



        /// <summary>
        /// Retrieves posts from the user and their friends based on the user's ID.
        /// </summary>
        /// <param name="userId">The ID of the user whose posts are to be retrieved.</param>
        /// <returns>An IHttpActionResult containing a list of posts.</returns>

        [BasicAuthentication]
        [HttpGet]
        [Route("UserPosts/{userId}")]
        public IHttpActionResult GetUserPosts(int userId)
        {
            try
            {
                var postsInfo = methods.GetUserPosts(userId);
                return Ok(postsInfo);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }



        /// <summary>
        /// Handles the "like" or "unlike" action for a post by a user. 
        /// If the user has not liked the post yet, a like is added and the post's like count is incremented. 
        /// If the user has already liked the post, the like is removed and the post's like count is decremented.
        /// </summary>
        /// <param name="request">An object containing the information needed to toggle a like on a post. 
        /// It includes the PostId of the post to be liked or unliked and the UserId of the user performing the action.</param>
        /// <returns>Returns an <see cref="IHttpActionResult"/> representing the result of the action. 
        /// If the post is found, returns an OK response with the updated like count and the new like status. 
        /// If the post is not found, returns a NotFound result.</returns>

        [BasicAuthentication]
        [HttpPost]
        [Route("PostLike")]
        public IHttpActionResult LikePost([FromBody] PostLike request)
        {
            if (request == null || !request.PostId.HasValue || !request.UserId.HasValue)
            {
                return BadRequest("Invalid request data.");
            }

            try
            {
                var result = methods.LikePost(request.PostId.Value, request.UserId.Value);
                return Ok(new { likeCount = result.LikeCount, isLiked = result.IsLiked });
            }
            catch (InvalidOperationException)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        /// <summary>
        /// Deletes a post from the database using the specified post ID.
        /// </summary>
        /// <param name="id">The ID of the post to delete.</param>
        /// <returns>An IHttpActionResult indicating the result of the operation.</returns>

        [BasicAuthentication]
        [HttpPut]
        [Route("Deletepost/{id}")]
        public IHttpActionResult DeletePost(int id)
        {
            try
            {
                methods.DeletePost(id);
                return Ok("Post deleted successfully.");
            }
            catch (SqlException ex)
            {
                // Log the exception details and return an internal server error
                return InternalServerError(ex);
            }
            catch (Exception ex)
            {
                // Catch any other exceptions
                return InternalServerError(ex);
            }
        }


        /// <summary>
        /// Adds a new comment to a specified post. This method creates a new comment record in the database,
        /// updates the comment count for the associated post, and returns an appropriate HTTP response.
        /// </summary>
        /// <param name="model">An object containing the details of the comment to be added. This includes:
        /// - <c>PostId</c>: The ID of the post to which the comment is being added.
        /// - <c>UserId</c>: The ID of the user making the comment.
        /// - <c>CommentText</c>: The content of the comment.
        /// - <c>ParentCommentId</c>: The ID of the parent comment if this is a reply; otherwise, null.
        /// - <c>IsDeleted</c>: A flag indicating whether the comment is deleted (0 indicates not deleted; this is set automatically).</param>
        /// <returns>An <see cref="IHttpActionResult"/> that represents the result of the operation. 
        /// If the comment is successfully added and the post's comment count is updated, an <see cref="OkResult"/> is returned.
        /// If the model is invalid, a <see cref="BadRequestResult"/> is returned with details about the validation errors.</returns>

        [BasicAuthentication]
        [HttpPost]
        [Route("AddComment")]
        public IHttpActionResult AddComment([FromBody] PostComment model)
        {
            if (ModelState.IsValid)
            {
                try
                {
                   var response= methods.AddComment(model);
                    return Ok(response);
                }
                catch (Exception ex)
                {
                    return InternalServerError(ex);
                }
            }
            return BadRequest(ModelState);
        }


        /// <summary>
        /// Retrieves the most recent comment from the PostComments table along with user data.
        /// </summary>
        /// <returns>
        /// An IHttpActionResult containing the latest comment with user data, or a NotFound result if no comments exist.
        /// </returns>

        [BasicAuthentication]
        [HttpGet]
        [Route("GetLastComment")]
        public IHttpActionResult GetLastComment()
        {
            try
            {
                var lastComment = methods.GetLastComment();
                if (lastComment == null)
                {
                    return NotFound();
                }

                return Ok(lastComment);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


       

        /// <summary>
        /// Retrieves and formats comments for a specific post.
        /// </summary>
        /// <param name="postId">The ID of the post to get comments for.</param>
        /// <returns>An IHttpActionResult containing the list of formatted comments.</returns>

        [BasicAuthentication]
        [HttpGet]
        [Route("GetPostComments/{postId}")]
        public IHttpActionResult GetPostComments(int postId)
        {
            try
            {
                var comments = methods.GetPostComments(postId);
                return Ok(comments);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        /// <summary>
        /// Retrieves replies for a specific parent comment.
        /// </summary>
        /// <param name="parentCommentId">The ID of the parent comment to get replies for.</param>
        /// <returns>An IHttpActionResult containing the list of replies.</returns>

        [BasicAuthentication]
        [HttpGet]
        [Route("GetCommentReplies/{parentCommentId}")]
        public IHttpActionResult GetCommentReplies(int parentCommentId)
        {
            try
            {
                var replies = methods.GetCommentReplies(parentCommentId);
                return Ok(replies);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        /// <summary>
        /// Deletes a comment from the database using the specified comment ID.
        /// </summary>
        /// <param name="commentId">The ID of the comment to delete.</param>
        /// <returns>An IHttpActionResult indicating the result of the operation.</returns>


        [BasicAuthentication]
        [HttpDelete]
        [Route("DeleteComment/{commentId}")]
        public IHttpActionResult DeleteComment(int commentId)
        {
            try
            {
                methods.DeleteComment(commentId);
                return Ok();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }

        /// <summary>
        /// Retrieves and formats posts for a specific user based on the given userId.
        /// </summary>
        /// <param name="userId">The ID of the user to get posts for.</param>
        /// <returns>An IHttpActionResult containing the list of formatted posts.</returns>

        [BasicAuthentication]
        [HttpGet]
        [Route("UserPosts1/{userId}")]
        public IHttpActionResult GetUserPosts1(int userId)
        {
            try
            {
                var posts = methods.GetUserPosts1(userId);
                return Ok(posts);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


        /// <summary>
        /// Adds a post to the archive using the specified post ID.
        /// </summary>
        /// <param name="id">The ID of the post to archive.</param>
        /// <returns>An IHttpActionResult indicating the result of the operation.</returns>

        [BasicAuthentication]
        [HttpPut]
        [Route("addarchievepost/{id}")]
        public IHttpActionResult AddArchievePost(int id)
        {
            try
            {
                methods.AddArchievePost(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        /// <summary>
        /// Removes a post from the archive using the specified post ID.
        /// </summary>
        /// <param name="id">The ID of the post to remove from the archive.</param>
        /// <returns>An IHttpActionResult indicating the result of the operation.</returns>

        [BasicAuthentication]
        [HttpPut]
        [Route("removearchievepost/{id}")]
        public IHttpActionResult RemoveArchievePost(int id)
        {
            try
            {
                methods.RemoveArchievePost(id);
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }


        /// <summary>
        /// Retrieves notifications for a specific user based on the provided user ID.
        /// </summary>
        /// <param name="userId">The ID of the user to get notifications for.</param>
        /// <returns>An IHttpActionResult containing the list of notifications.</returns>

        [BasicAuthentication]
        [HttpGet]
        [Route("notifications/{userId}")]
        public IHttpActionResult GetUserNotifications(int userId)
        {
            var notifications = methods.GetUserNotifications(userId);
            return Ok(notifications);
        }


        /// <summary>
        /// Adds a friend request from the current user to another user.
        /// </summary>
        /// <param name="request">The UserFriend object containing the user IDs for the friend request.</param>
        /// <returns>An IHttpActionResult indicating the result of the operation.</returns>

        [BasicAuthentication]
        [HttpPost]
        [Route("AddFriend")]
        public IHttpActionResult AddFriend(UserFriend request)
        {
            if (request.FollowerId == null)
            {
                return BadRequest("FollowerId cannot be null.");
            }

            int currentUserId = (int)request.FollowerId; // Ensure FollowerId is not null

            try
            {
                // Ensure request.UserId is not null and cast it to int
                if (request.UserId == null)
                {
                    return BadRequest("UserId cannot be null.");
                }

                int friendUserId = (int)request.UserId;

                methods.AddFriend(currentUserId, friendUserId);
                return Ok();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }



        /// <summary>
        /// Removes a friendship between the current user and the specified friend.
        /// </summary>
        /// <param name="request">The UserFriend object containing the user IDs for the friendship to remove.</param>
        /// <returns>An IHttpActionResult indicating the result of the operation.</returns>

        [BasicAuthentication]
        [HttpPost]
        [Route("RemoveFriend")]
        public IHttpActionResult RemoveFriend(UserFriend request)
        {
            if (request.UserId == null || request.FollowerId == null)
            {
                return BadRequest("UserId and FollowerId cannot be null.");
            }

            int currentUserId = (int)request.UserId;
            int friendId = (int)request.FollowerId;

            try
            {
                methods.RemoveFriend(currentUserId, friendId);
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }



        /// <summary>
        /// Confirms a friend request between the current user and the specified friend.
        /// </summary>
        /// <param name="request">The UserFriend object containing the user IDs for the friend request.</param>
        /// <returns>An IHttpActionResult indicating the result of the operation.</returns>

        [BasicAuthentication]
        [HttpPost]
        [Route("ConfirmFriendRequest")]
        public IHttpActionResult ConfirmFriendRequest(UserFriend request)
        {
            if (request.UserId == null || request.FollowerId == null)
            {
                return BadRequest("UserId and FollowerId cannot be null.");
            }

            int userId = (int)request.UserId;
            int followerId = (int)request.FollowerId;

            try
            {
                methods.ConfirmFriendRequest(userId, followerId);
                return Ok();
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }




        /// <summary>
        /// Initiates a password reset process for the specified email address.
        /// </summary>
        /// <param name="email">The email address of the user requesting a password reset.</param>
        /// <returns>An IHttpActionResult indicating the result of the operation.</returns>

       
        [HttpPost]
        [Route("Forgotpassword")]
        public IHttpActionResult ForgotPassword([FromBody] string email)
        {
            if (string.IsNullOrEmpty(email))
            {
                return BadRequest("Email is required.");
            }

            try
            {
                methods.HandleForgotPassword(email);
                return Ok();
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound();
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }



        /// <summary>
        /// Handles the password reset functionality. This method validates the provided token, checks for expiration, 
        /// ensures the token belongs to a valid user, and updates the user's password if all conditions are met. 
        /// It also verifies that the new password is not one of the last three passwords used by the user.
        /// </summary>
        /// <param name="token">The password reset token sent to the user, which is used to validate and identify the reset request.</param>
        /// <param name="password">The new password that the user wants to set.</param>
        /// <returns>An IHttpActionResult indicating the result of the password reset operation. 
        /// Returns a BadRequest if the token is invalid or expired, if the user does not exist, or if the new password is reused.
        /// Returns an Ok if the password was updated successfully.</returns>


       
        [HttpGet]
        [Route("Resetpassword")]
        public IHttpActionResult ResetPassword(string token, string password)
        {
            try
            {
                methods.ResetUserPassword(token, password);
                return Ok(new { Result = "Password has been updated successfully." });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }



        /// <summary>
        /// Verifies the validity and expiration of a password reset token. 
        /// Checks if the token exists and whether it has expired (valid for 10 minutes). 
        /// Returns the token's creation time if valid; otherwise, returns an error message.
        /// </summary>
        /// <param name="token">The password reset token to check.</param>
        /// <returns>An IHttpActionResult with:
        /// - BadRequest if the token is missing, invalid, or expired.
        /// - Ok with the token's creation time if the token is valid.</returns>

        
        [HttpGet]
        [Route("CheckTokenExpiration")]
        public IHttpActionResult CheckTokenExpiration(string token)
        {
            try
            {
                var creationTime = methods.CheckTokenExpiration(token);
                return Ok(new { creationTime });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (Exception ex)
            {
                return InternalServerError(ex);
            }
        }


    }
}











