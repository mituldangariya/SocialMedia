$(document).ready(function () {


    var userId = getCookie("userId");

    if (userId) {
        console.log('User ID:', userId);
    } else {
        console.log('User not logged in');
        window.location.href = "/Login/Login";
    }



    $('#notification-menu').hide();
    loadUserPosts();
    populateUserData(userId);
    FriendList();

    $("#notificationLink").click(function () {
        console.log("flow goes right")
        $('.timelineDiv').hide();
        $('.loadMore').hide();
        $('.central-meta').hide();
        $('#notification-menu').show();
    });

    $("#home-element").click(function () {
        $('.loadMore').show();
        $('.central-meta').show();
        $('#notification-menu').hide();
    });

    $("#logoutButton").click(function () {
        sessionStorage.clear();
        window.location.href = "/Login/Login";
    });

    $('#updateButton').click(updateUserInfo);
    $('#changePasswordButton').click(changePassword);
    $('#submitButton').click(UploadPost);



    $('#editinfoLink').click(function () {
        $('#timelineDiv').hide();
        $('#editinfoDiv').show();
        $('#changepasswordDiv').hide();
        $('#acceptedFollowerDiv').hide();
        $('#followingDiv').hide();
        $('#postDiv').hide();
        $('#archieveDiv').hide();

        $('#timelineLink').removeClass('active');
        $('#editinfLink').addClass('active');
        $('#changePasswordLink').removeClass('active');
        $('#followersLink').removeClass('active');
        $('#followingLink').removeClass('active');
        $('#postLink').removeClass('active');
        $('#archieveLink').removeClass('active');

    });

   

    $('#followersLink').click(function () {
        fetchConfirmFriend();
        $('#timelineDiv').hide();
        $('#editinfoDiv').hide();
        $('#changepasswordDiv').hide();
        $('#acceptedFollowerDiv').show();
        $('#followingDiv').hide();
        $('#postDiv').hide();
        $('#archieveDiv').hide();

        $('#timelineLink').removeClass('active');
        $('#editinfoLink').removeClass('active');
        $('#changePasswordLink').removeClass('active');
        $('#followersLink').addClass('active');
        $('#followingLink').removeClass('active');
        $('#postLink').removeClass('active');
        $('#archieveLink').removeClass('active');

    });

   




    $('#postLink').click(function () {
        loadUserPostsHomePage();
        $('#timelineDiv').hide();
        $('#editinfoDiv').hide();
        $('#changepasswordDiv').hide();
        $('#acceptedFollowerDiv').hide();
        $('#followingDiv').hide();
        $('#timelineDiv').hide();
        $('#postDiv').show();
        $('#archieveDiv').hide();

        $('#timelineLink').removeClass('active');
        $('#editinfolLink').removeClass('active');
        $('#changePasswordLink').removeClass('active');
        $('#followersLink').removeClass('active');
        $('#followingLink').removeClass('active');
        $('#postLink').addClass('active');
        $('#archieveLink').removeClass('active');
    });




    $('#archieveLink').click(function () {
        loadarchievepost();
        $('#timelineDiv').hide();
        $('#editinfoDiv').hide();
        $('#changepasswordDiv').hide();
        $('#acceptedFollowerDiv').hide();
        $('#followingDiv').hide();
        $('#timelineDiv').hide();
        $('#postDiv').hide();
        $('#archieveDiv').show();

        $('#timelineLink').removeClass('active');
        $('#editinfoLink').removeClass('active');
        $('#changePasswordLink').remove('active');
        $('#followersLink').removeClass('active');
        $('#followingLink').removeClass('active');
        $('#postLink').removeClass('active');
        $('#archieveLink').addClass('active');
    });


    $('#timelineLink').click(function () {
        $('#timelineDiv').show();
        $('#editinfoDiv').hide();
        $('#changepasswordDiv').hide();
        $('#followersDiv').hide();
        $('#followingDiv').hide();
        $('#acceptedFollowerDiv').hide();
        $('#postDiv').hide();
        $('#archieveDiv').hide();


        $('#editinfoLink').removeClass('active');
        $('#timelineLink').addClass('active');
        $('#changePasswordLink').removeClass('active');
        $('#followersLink').removeClass('active');
        $('#followingLink').removeClass('active');
        $('#postLink').removeClass('active');
        $('#archieveLink').removeClass('active');
    });






});

function getCookie(cookieName) {
    var name = cookieName + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var cookieArray = decodedCookie.split(';');
    for (var i = 0; i < cookieArray.length; i++) {
        var cookie = cookieArray[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) == 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return "";
}

$(document).ready(function () {
    // Function to validate email
    function validateEmail(email) {
        const re = /^[^@]+@[^@]+\.[^@]+$/; 
        return re.test(email);
    }

    function validateForm() {
        let isValid = true;

        // Validate First Name
        const firstName = $('#TxtFirstName').val();
        if (!firstName) {
            $('#firstNameError').text("Please Enter Your First Name.").show();
            isValid = false;
        } else if (!/^[a-zA-Z]+$/.test(firstName)) {
            $('#firstNameError').text("First Name should only contain alphabetic characters.").show();
            isValid = false;
        } else {
            $('#firstNameError').hide();
        }

        // Validate Last Name
        const lastName = $('#TxtLastName').val();
        if (!lastName) {
            $('#lastNameError').text("Please Enter Your Last Name.").show();
            isValid = false;
        } else if (!/^[a-zA-Z]+$/.test(lastName)) {
            $('#lastNameError').text("Last Name should only contain alphabetic characters.").show();
            isValid = false;
        } else {
            $('#lastNameError').hide();
        }

        // Validate City
        const city = $('#TxtCity').val();
        if (!city) {
            $('#cityError').text("City is required.").show();
            isValid = false;
        } else {
            $('#cityError').hide();
        }

        // Validate Email
        const email = $('#TxtEmail').val();
        if (!email) {
            $('#emailError').text("Please Enter A Valid Email.").show();
            isValid = false;
        } else if (!validateEmail(email)) {
            $('#emailError').text("Valid Email is required.").show();
            isValid = false;
        } else {
            $('#emailError').hide();
        }

        // Validate Phone Number
        const phoneNumber = $('#TxtPhoneNumber').val();
        if (!phoneNumber) {
            $('#phoneError').text("Phone Number is required.").show();
            isValid = false;
        } else if (!/^[0-9]{10,12}$/.test(phoneNumber)) {
            $('#phoneError').text("Phone Number should be 10 to 12 digits long.").show();
            isValid = false;
        } else {
            $('#phoneError').hide();
        }

        // Validate Birth Date
        const birthDate = $('#BirthDate').val();
        if (!birthDate) {
            $('#birthDateError').text("Birth Date is required.").show();
            isValid = false;
        } else {
            $('#birthDateError').hide();
        }

        return isValid;
    }

    $('#updateButton').on('click', function () {
        if (validateForm()) {
            $('#myForm').submit();
            window.location.href = '/Login/HomePage';
        } else {
            $("#NewloginError").text("Please correct the errors above.");
        }
    });
});



function toggleComments(element, postId) {
    var commentArea = $(element).closest('.post-meta').find('.comment-area');
    if (commentArea.is(':visible')) {
        commentArea.hide();
    } else {
        commentArea.show();
        loadPostComments(postId, commentArea.find('.we-comet'));
    }
}


// Add New Post Img and Videos
function AddPost(post) {
    var userId = getCookie("userId");
    var isLikedClass = post.isLiked ? 'fa-solid fa-heart liked' : 'fa-regular fa-heart';

    var deleteButtonHTML = '';
    if (userId && userId === post.UserId) {
        deleteButtonHTML = `<button class="delete-btn" onClick="deletePost(${post.PostId})">Delete</button>`;
    }

    var mediaHTML = '';
    if (post.PostPhoto) {
        const fileExtension = post.PostPhoto.split('.').pop().toLowerCase();
        if (['mp4', 'avi', 'mov', 'wmv'].includes(fileExtension)) {
            mediaHTML = `
        <div style="position: relative; height: 300px; width: 650px; border-radius: 12px; overflow: hidden;">
            <video id="postVideo" height="100%" width="100%" style="object-fit: cover;" controls>
                <source src="${post.PostPhoto}" type="video/${fileExtension}">
            </video>
            <div id="videoOverlay" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); display: flex; align-items: center; justify-content: center;">
                <svg id="pauseIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000" width="20" height="20" style="display: none; cursor: pointer;">
                    <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/>
                </svg>
                <svg id="playIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#000" width="20" height="20" style="cursor: pointer;">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            </div>
        </div>`;
        } else if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
            mediaHTML = `<img src="${post.PostPhoto}" alt="Post Media" height="208" width="200">`;
        }
    }

    const style = document.createElement('style');
    style.innerHTML = `
                video::-webkit-media-controls-volume-slider,
                video::-webkit-media-controls-mute-button,
                video::-webkit-media-controls-fullscreen-button,
                video::-webkit-media-controls-moreoptions-button,
                video::-webkit-media-controls-nodownload,
                video::-webkit-media-controls-playback-rate-button,
                video::-webkit-media-controls-current-time-display,
                video::-webkit-media-controls-panel,
                video::-webkit-media-controls-time-remaining-display {
                display: none !important;
              }`;

    document.head.appendChild(style);

    document.addEventListener('DOMContentLoaded', function () {
        const video = document.getElementById('postVideo');
        const videoOverlay = document.getElementById('videoOverlay');
        const playIcon = document.getElementById('playIcon');
        const pauseIcon = document.getElementById('pauseIcon');

        function updateOverlay() {
            if (video.paused) {
                videoOverlay.style.display = 'flex';
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            } else {
                videoOverlay.style.display = 'none';
                playIcon.style.display = 'none';
                pauseIcon.style.display = 'block';
            }
        }

        video.addEventListener('play', updateOverlay);
        video.addEventListener('pause', updateOverlay);
        video.addEventListener('timeupdate', updateOverlay);

        videoOverlay.addEventListener('click', function () {
            if (video.paused) {
                video.play();
            } else {
                video.pause();
            }
        });

        playIcon.addEventListener('click', function () {
            video.play();
            playIcon.style.display = 'none';
            pauseIcon.style.display = 'block';
        });

        pauseIcon.addEventListener('click', function () {
            video.pause();
            pauseIcon.style.display = 'none';
            playIcon.style.display = 'block';
        });

        updateOverlay();
    });



    var postHTML =
        `<div class="central-meta item">
            <div class="user-post">
                <div class="friend-info">
                    <figure>
                        <img src="${post.ProfilePhoto}" alt="" height="54" width="54" id="ProfilePhoto" class="zoomable">
                    </figure>
                    <div class="friend-name">
                        ${post.UserId == userId ? `<i class="fas fa-ellipsis-h more-icon" data-toggle="tooltip" title="More"></i>` : ''}
                        <div class="friend-name">
                            <ins onclick="ShowFriendProfile(${post.UserId})" style="cursor: pointer">${post.FirstName} ${post.LastName}</ins>
                            <span hidden>${post.UserId}</span>
                            <button class="delete-btn" onClick="deletePost(${post.PostId})"> <i class="fas fa-trash"></i></button>
                        </div>
                        <span>published: ${post.PostDate}</span>
                    </div>
                </div>
                <div class="description">
                    <p>${post.PostContent}</p>
                </div>
                <div class="post-meta">
                    ${mediaHTML}
                    <div class="we-video-info">
                        <ul class="d-flex">
                            <li>
                                <span class="views like-button" data-toggle="tooltip" title="like" data-post-id="${post.PostId}">
                                    <i class="${isLikedClass}" id="like"></i>
                                    <ins>${post.LikeCount}</ins>
                                </span>
                            </li>
                            <li>
                                <span class="comment" data-toggle="tooltip" title="comment" onclick="toggleComments(this, ${post.PostId})">
                                    <i class="fa fa-comments-o"></i>
                                    <ins>${post.CommentCount}</ins>
                                </span>
                            </li>
                        </ul>
                    </div>
                    <div class="comment-area" style="display: none;">
                        <div class="post-comt-box">
                         <textarea id="commentTextarea" placeholder="Post your comment" maxlength="60" onchange="commentlenght()"></textarea>
                            <button class="btn-primary" id="Postbtn">Comment</button>
                                    <span id="commenterror" hidden></span>

                        </div>
                         <span id="maxLengthMessage" hidden>You have reached the maximum length.</span>
                        <ul class="we-comet"></ul>
                    </div>
                    <span id="comment-error"></span>
                </div>
            </div>
        </div>`;

    return postHTML;
}

// CommentLenght
function commentlenght() {
    const commentTextarea = document.getElementById('commentTextarea');
    const maxLengthMessage = document.getElementById('maxLengthMessage');
    const maxLength = commentTextarea.maxLength;

    commentTextarea.addEventListener('keypress', handleKeyPress);
    commentTextarea.addEventListener('keydown', handleKeyDown);

    function handleKeyPress(event) {
        const currentLength = commentTextarea.value.length;
        if (currentLength === maxLength && event.key !== 'Backspace' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
            event.preventDefault();
            maxLengthMessage.textContent = `You have reached the maximum length of ${maxLength} characters.`;
            maxLengthMessage.style.display = 'block';
        } else {
            maxLengthMessage.style.display = 'none';
        }
    }

    function handleKeyDown(event) {
        const currentLength = commentTextarea.value.length;
        if (currentLength === maxLength && event.key !== 'Backspace' && event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') {
            event.preventDefault();
            maxLengthMessage.textContent = `You have reached the maximum length of ${maxLength} characters.`;
            maxLengthMessage.style.display = 'block';
        } else {
            maxLengthMessage.style.display = 'none';
        }
    }
}



function getPosts(userId, searchQuery) {

    $.ajax({
        url: '/api/WebApi/GetPosts',
        type: 'GET',
        data: { userId: userId, searchQuery: searchQuery },
        success: function (response) {

            console.log('Posts:', response);

            loadUserPosts();
        },
        error: function (xhr, status, error) {

            console.error('Error:', error);
        }
    });
}



var userId = getCookie('userId');

if (userId) {
    getPosts(userId, 'exampleSearchQuery');
} else {
    console.error('User ID not found in cookie.');
}

function getCookie(name) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(name + '=') === 0) {
            return cookie.substring(name.length + 1);
        }
    }
    return null;
}





//Post Upload

function UploadPost() {
    const fileInput = document.getElementById('userpost');
    const file = fileInput.files[0];
    var userId = getCookie("userId");

    const postContent = document.getElementById('postContent').value.trim();
    const postContentError = document.getElementById('postContentError');

    if (!postContent) {
        postContentError.style.display = 'block';
        return;
    } else {
        postContentError.style.display = 'none';
    }

    const formData = new FormData();
    formData.append('userId', userId);
    formData.append('PostContent', postContent);
    if (file) {
        formData.append('file', file);
    }

    $.ajax({
        url: '/api/WebApi/NewPost',
        type: 'POST',
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            console.log("Post Added", data);
            $("#userpost").val("");
            $("#postContent").val("");

            $.ajax({
                url: '/api/WebApi/GetLastPost',
                type: 'GET',
                success: function (data) {
                    data.forEach(function (post) {
                        $('#page-contents .loadMore').prepend(AddPost(post));
                    });

                    $('.like-button').click(function () {
                        var $this = $(this);
                        var postId = $this.data('post-id');
                       
                        var user = getCookie("userId");
                        $.ajax({
                            url: '/api/WebApi/PostLike',
                            method: 'POST',
                            data: { postId: postId, userId: user },
                            success: function (data) {
                                $this.find('ins').text(data.likeCount);
                                if (data.isLiked) {
                                    $this.find('i').removeClass('fa-regular fa-heart').addClass('fa-solid fa-heart liked');
                                } else {
                                    $this.find('i').removeClass('fa-solid fa-heart liked').addClass('fa-regular fa-heart');
                                }

                            },
                            error: function (error) {
                                console.log(error);
                            }
                        });
                    });
                    $('.post-comt-box button').click(UploadComment);
                },
                error: function (xhr, status, error) {
                    console.error("Post Not added", error);
                }
            })
        },
        error: function (xhr, status, error) {
            console.error("Post Not added", error);
        }
    });
}

//  Post Uploaded User Friend
function loadUserPosts() {
    var userId = getCookie('userId');

    $.ajax({
        url: '/api/WebApi/UserPosts/' + userId,
        method: 'GET',
        success: function (data) {
            var postsHTML = '';

            data.reverse().forEach(function (post) {
                if (post.Status != 1) {
                    postsHTML += AddPost(post);
                }
            });

            $('#page-contents .loadMore').html(postsHTML);

            $('.we-comet').each(function () {
                var $this = $(this);
                var postId = $this.closest('.central-meta').find('.like-button').data('post-id');
                loadPostComments(postId, $this);
            });

            $('.like-button').click(function () {
                var $this = $(this);
                var postId = $this.data('post-id');
                var userId = getCookie("userId");
                $.ajax({
                    url: '/api/WebApi/PostLike',
                    method: 'POST',
                    data: { postId: postId, userId: userId },
                    success: function (data) {
                        $this.find('ins').text(data.likeCount);
                        if (data.isLiked) {
                            $this.find('i').removeClass('fa-regular fa-heart').addClass('fa-solid fa-heart liked');
                        } else {
                            $this.find('i').removeClass('fa-solid fa-heart liked').addClass('fa-regular fa-heart');
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            });

            $('.friend-name').click(ShowFriendProfile);
            $('.post-comt-box button').click(UploadComment);
        },
        error: function (error) {
            console.log(error);
        }
    });
}



//Post Delete
function deletePost(postId) {
    $('#custom-confirm-modal').css('display', 'block');

    $('#confirm-delete').on('click', function () {
        $.ajax({
            url: '/api/WebApi/Deletepost/' + postId,
            method: 'PUT',
            success: function (data) {
                $(`.like-button[data-post-id="${postId}"]`).closest('.central-meta.item').hide();
                console.log("Post deleted");
                $('#custom-confirm-modal').css('display', 'none');
            },
            error: function (error) {
                console.error("Error deleting post:", error);
            }
        });
    });

    $('#cancel-delete').on('click', function () {
        console.log("Post deletion canceled");
        $('#custom-confirm-modal').css('display', 'none');
    });
}



document.querySelectorAll('.zoomable').forEach(item => {
    item.addEventListener('transitionend', () => {
        item.style.transition = '';
    });
});


function toggleLike(likeType, postId) {
    const likeIcon = document.getElementById('like');
    const likeCountElement = document.getElementById('like-count');
    const currentLikes = parseInt(likeCountElement.innerText);

    if (likeType === 'liked') {
        likeIcon.classList.remove('fa-heart liked');
        likeIcon.classList.add('fa-heart-o');
        likeIcon.style.color = '';
        likeCountElement.innerText = currentLikes - 1;

    } else {
        likeIcon.classList.remove('fa-heart-o');
        likeIcon.classList.add('fa-heart');
        likeIcon.style.color = 'red';
        likeCountElement.innerText = currentLikes + 1;

    }
}


function toggleHeartColor() {
    const likeIcon = document.getElementById('like');
    if (likeIcon.style.color === 'black') {
        likeIcon.style.color = 'red';
    } else {
        likeIcon.style.color = 'black';
    }
}

function toggleDeleteButtonVisibility(event) {
    const deleteBtn = event.target.closest('.central-meta').querySelector('.delete-btn');
    if (deleteBtn) {
        deleteBtn.style.display = (deleteBtn.style.display === 'block') ? 'none' : 'block';
    }
}

// Event delegation for dynamically added posts
document.body.addEventListener('click', function (event) {
    const moreIcon = event.target.closest('.more-icon');
    if (moreIcon) {
        toggleDeleteButtonVisibility(event);
    }
});




//User Profile
function loadUserProfile(userId) {
    $.ajax({
        url: `/api/WEbApi/UserProfile?userId=${userId}`,
        type: 'GET',
        success: function (user) {
            // Update the main content area with user profile details
            $('#UserName').text(`${user.FirstName} ${user.LastName}`);
            $('#ProfilePhoto').attr('src', user.ProfileImage);
            $('#City').html(`<i class="fa-solid fa-city"></i> ${user.City}`);
            $('#PhoneNumber').html(`<i class="fa-solid fa-phone"></i> ${user.PhoneNumber}`);
            $('#Email').html(`<i class="fa-solid fa-envelope"></i> ${user.Email}`);

            // Clear and populate interests
            $('#interestdata').empty();
            user.Interests.forEach(interest => {
                $('#interestdata').append(`<li>${interest}</li>`);
            });

            // Clear and populate bio
            $('#BioInfo').empty();
            $('#BioInfo').append(`<li>${user.Bio}</li>`);

            // Update friends list
            $('#acceptUserList').empty();
            user.Friends.forEach(friend => {
                $('#acceptUserList').append(`<li>${friend}</li>`);
            });

            // Update posts
            $('#UserPostDiv .photos').empty();
            user.Posts.forEach(post => {
                $('#UserPostDiv .photos').append(`
                    <li>
                        <img src="${post.ImageUrl}" alt="${post.Caption}">
                        <p>${post.Caption}</p>
                    </li>
                `);
            });

            // Show the relevant sections
            $('#timelineDiv').show();
            $('#acceptedFollowerDiv').show();
            $('#postDiv').show();
        },
        error: function (error) {
            console.log('Error fetching user profile:', error);
        }
    });
}



//Comment Replies
function ShowReplies(replies) {
 
    var userId = getCookie("userId");
    let replyHTML = '';
    if (replies && replies.length > 0) {
        replies.forEach(function (reply) {
            replyHTML += `
            <li class="reply-item">
                <div class="comet-avatar">
                    <img src="${reply.ProfilePhoto}" alt="" height="45" width="45">
                </div>
                <div class="we-comment">
                    <div class="coment-head">
                        <h5>${reply.UserName}</h5>
                        <span>${reply.CommentDate}</span>
                        <i hidden>${reply.CommentId}</i>
                        ${reply.UserId == userId ? '<i class="fa-solid fa-ellipsis"></i>' : ''}
                        <div class="comment-options" style="display: none;">
                            <button class="btn btn-danger delete-reply-btn">Delete</button>
                        </div>
                    </div>
                    <p>${reply.CommentText}</p>
                </div>
            </li>
        `;
        });
    }
    return replyHTML;
}



// Display All PostComments
function loadPostComments(postId, $commentsList) {

    var userId = getCookie("userId");
    $.ajax({
        url: '/api/WebApi/GetPostComments/' + postId,
        method: 'GET',
        success: function (comments) {
            $commentsList.empty();

            if (comments.length === 0) {
                /* $commentsList.append('<li id="NoComments">No comments yet.</li>');*/
            } else {
                comments.forEach(function (comment) {
                    const commentHtml = `
                    <li data-comment-id="${comment.Id}">
                        <div class="comet-avatar">
                            <img src="${comment.ProfilePhoto}" alt="" height="40" width="40" id="ProfilePhoto">
                        </div>
                        <div class="we-comment">
                            <div class="coment-head">
                                <h5>${comment.UserName}</h5>
                                <span hidden>${comment.CommentId}</span>
                                <span>${comment.CommentDate}</span>
                                     <i class="fa-solid fa-share"></i>
                                    

                                ${comment.UserId == userId ? `
                                <div class="comment-options">   
                                  <div class="comment-options">
                                       <button class="delete-comment-btn custom-style" onclick="deleteComment(${comment.CommentId})"> <i class="fas fa-trash"></i></button>
                                   </div>

                                </div>` : ''}
                            </div>


                            <p>${comment.CommentText}</p>
                        </div>

                            <div id="replyModal" class="modal">
                               <div class="modal-content">
                                     <span class="close">&times;</span>
                                         <h3>Reply to Comment</h3>
                                     <textarea id="replyText" placeholder="Enter your reply" autofocus></textarea>
                                     <button class="btn btn-success" id="submitReply">Reply Comment</button>
                               </div>
                            </div>
                    </li>`;

                    $commentsList.append(commentHtml);
                });


                $commentsList.find('.fa-share').click(function () {
                    var commentId = $(this).closest('li').find('span[hidden]').text();
                    replieComment(commentId, postId);
                });
                $commentsList.find('.delete-reply-btn').click(function () {
                    var commentId = $(this).closest('li').find('i[hidden]').text();
                    var $reply = $(this).closest('li');
                    deleteComment(commentId, $reply);
                });
                $commentsList.find('.fa-ellipsis').click(function () {
                    $(this).siblings('.comment-options').toggle();
                });
                $commentsList.find('.delete-comment-btn').click(function () {
                    var commentId = $(this).closest('li').find('span[hidden]').text();
                    var $comment = $(this).closest('li');
                    DeleteComment(commentId, $comment);
                });

                $commentsList.find('.more-options').click(function (e) {
                    e.preventDefault();
                    $(this).siblings('.edit-delete-options').toggle();
                });

               
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}




function addCommentReply(replyText, postId, parentCommentId, userId) {
    var UserName = sessionStorage.getItem('Username');
    var ProfilePhoto = sessionStorage.getItem('ProfilePhoto');
    $.ajax({
        url: '/api/WebApi/AddComment',
        method: 'POST',
        data: {
            postId: postId,
            userId: userId,
            commentText: replyText,
            parentCommentId: parentCommentId,
            ProfilePhoto: ProfilePhoto

        },
        success: function (data) {
            $.ajax({
                url: '/api/WebApi/GetLastComment',
                type: 'GET',
                success: function (data) {
                    data.forEach(function (comment) {
                        var $parentComment = $(`li span[hidden]:contains(${parentCommentId})`).closest('li');
                        var $replyList = $parentComment.find('.reply-list');
                        var replyHTML = `
                        <li class="reply-item">
                            <div class="comet-avatar">
                                <img src="${comment.ProfilePhoto}" alt="" height="45" width="45" id="ProfilePhoto">
                            </div>
                            <div class="we-comment">
                                <div class="coment-head">
                                    <h5>${UserName}</h5>
                                    <span>${comment.CommentDate}</span>
                                    <i hidden>${comment.CommentId}</i>
                                    ${comment.UserId == userId ? '<i class="fa-solid fa-ellipsis"></i>' : ''}
                                    <div class="comment-options" style="display: none;">
                                        <button class="btn btn-danger delete-reply-btn">Delete</button>
                                    </div>
                                </div>
                                <p>${comment.CommentText}</p>
                            </div>
                        </li> `;

                        $replyList.append(replyHTML);
                        $replyList.find('.delete-reply-btn').click(function () {
                            var commentId = $(this).closest('li').find('i[hidden]').text();
                            var $reply = $(this).closest('li');
                            DeleteComment(commentId, $reply);
                        });
                        $replyList.find('.fa-ellipsis').click(function () {
                            $(this).siblings('.comment-options').toggle();
                        });
                    });
                },
                error: function (error) {
                    console.log(error);
                }
            });
        },
        error: function (error) {
            console.log('Error adding new reply:', error);
        }
    });
}



function replieComment(commentId, postId) {
   
    var userId = getCookie("userId");

    var modal = document.getElementById("replyModal");
    var replyText = document.getElementById("replyText");
    var submitReply = document.getElementById("submitReply");
    var span = document.getElementsByClassName("close")[0];
    modal.style.display = "block";
    span.onclick = function () {
        modal.style.display = "none";
        $('#replyText').focus();
    }
    window.onclick = function (event) {
        if (event.target == modal) {
            $('#replyText').focus();
            modal.style.display = "none";
        }
    }
    submitReply.onclick = function () {
        var replyTextValue = replyText.value.trim();
        if (replyTextValue !== '') {
            addCommentReply(replyTextValue, postId, commentId, userId);
            modal.style.display = "none";
            replyText.value = "";
        }
    }
}



//upload comment
function UploadComment() {
    var $form = $(this).closest('.post-comt-box');
    var postId = $form.closest('.central-meta').find('.like-button').data('post-id');
    var commentText = $form.find('textarea').val();
   
    var userId = getCookie("userId");

    var username = sessionStorage.getItem('Username');
    var ProfilePhoto = sessionStorage.getItem('ProfilePhoto');

    if (commentText.trim() !== '') {
        $.ajax({
            url: '/api/WebApi/AddComment',
            method: 'POST',
            data: { postId: postId, userId: userId, commentText: commentText, ProfilePhoto: ProfilePhoto },
            success: function () {
                $.ajax({
                    url: '/api/WebApi/GetLastComment',
                    type: 'GET',
                    success: function (comment) {
                        if (comment) {
                            $form.find('textarea').val('');
                            var commentHTML = `<li>
                                <div class="comet-avatar">
                                    <img src="${comment.ProfilePhoto}" alt="" height="45" width="45" id="ProfilePhoto">
                                </div>
                                <div class="we-comment">
                                    <div class="coment-head">
                                        <h5>${comment.FirstName} ${comment.LastName}</h5>
                                        <span>Just Now</span>
                                        ${comment.UserId == userId ? '<i class="fa-solid fa-ellipsis"></i>' : ''}
                                        <div class="comment-options" style="display: none;">
                                            <button class="btn btn-danger delete-comment-btn" Onclick=deleteComment(${comment.CommentId});><i class="fas fa-trash"></i> </button>
                                        </div>


                                    </div>
                                    <p>${comment.CommentText}</p>
                                </div>
                            </li>`;
                            $form.closest('.comment-area').find('.we-comet').prepend(commentHTML);

                            $(document).on('click', '.fa-ellipsis', function () {
                                $(this).siblings('.comment-options').toggle();
                            });

                            $(document).on('click', '.delete-comment-btn', function () {
                                var commentId = $(this).closest('li').find('span[hidden]').text();
                                var $comment = $(this).closest('li');
                                DeleteComment(commentId, $comment);
                            });
                        }
                    },
                    error: function (error) {
                        console.log(error);
                    }
                });
            },
            error: function (error) {
                console.log(error);
            }
        });
    }
}




//Comment Delete 
function deleteComment(commentId) {
    Swal.fire({
        title: 'Are you sure?',
        text: "Do you really want to delete this comment?",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            var userId = sessionStorage.getItem('userId');

            $.ajax({
                url: '/api/WebApi/DeleteComment/' + commentId,
                type: 'DELETE',
                headers: {
                    'Authorization': userId
                },
                success: function (response) {
                    Swal.fire(
                        'Deleted!',
                        'Your comment has been deleted.',
                        'success'
                    );
                },
                error: function (xhr, status, error) {
                    Swal.fire(
                        'Error!',
                        'There was an error deleting your comment.',
                        'error'
                    );
                    console.error('Error deleting comment:', error);
                }
            });
        }
    });
}


//Friend List 

function FriendList() {
  
    var userId = getCookie("userId");

    $.ajax({
        url: '/api/WebApi/GetUserData/' + userId,
        method: 'GET',
        success: function (data) {
            var peopleList = $('.friendz-list');
            peopleList.empty();
            if (data.length === 0) {
                peopleList.append('<li>No users found.</li>');
            } else {

                data.sort(function (a, b) {
                    if (a.RequestStatus === 'pending' && b.RequestStatus !== 'pending') {
                        return -1;
                    } else if (a.RequestStatus !== 'pending' && b.RequestStatus === 'pending') {
                        return 1;
                    } else {
                        return 0;
                    }
                });
                data.forEach(function (user) {
                    var userHTML = `
                    <li>
                        <div style="display: flex;justify-content: space-between;">
                            <figure>
                        <img src="${user.ProfilePhoto}" onclick="ShowFriendProfile(${user.UserId})" class="media-object pull-left" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; cursor: pointer;" alt="Profile Photo">
                            </figure>
                            <div style="display: inline;">
                                <i>${user.FirstName} ${user.LastName}</i>
                                <i hidden>${user.UserId}</i>
                            </div>

                            <div style="display: inline;">
                             ${user.IsFriend == 1 && user.FollowerId == userId
                            ? `<button class="btn btn-outline-danger remove-friend-btn" data-user-id="${user.UserId}">Remove</button>`
                            : user.RequestStatus === "pending"
                                ? `<button class="btn btn-outline-primary confirm-friend-btn" data-user-id="${user.UserId}">Confirm</button>
                                            <button class="btn btn-outline-danger remove-friend-btn" data-user-id="${user.UserId}">Remove</button>`
                                : user.RequestStatus === "accepted"
                                    ? `<button class="btn btn-outline-danger remove-friend-btn" data-user-id="${user.UserId}">Remove</button>`
                                    : `<button class="btn btn-outline-secondary add-friend-btn" data-user-id="${user.UserId}">Add Friend</button>`
                        }
                            </div>
                        </div>
                    </li>
                    `;
                    peopleList.append(userHTML);
                });
                $('.add-friend-btn').on('click', function () {
                    var userId = $(this).data('user-id');
                    addFriend(userId);
                });
                $('.remove-friend-btn').on('click', function () {
                    var userId = $(this).data('user-id');
                    removeFriend(userId);
                });
                $('.confirm-friend-btn').on('click', function () {
                    var userId = $(this).data('user-id');
                    confirmFriendRequest(userId);
                });
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}


function addFriend(userId) {
  
    var currentUserId = getCookie("userId");

    $.ajax({
        url: '/api/WebApi/AddFriend',
        method: 'POST',
        data: {
            userId: currentUserId,
            followerId: userId
        },
        success: function (data) {
            console.log('Friend added successfully');
            FriendList();
        },
        error: function (error) {
            console.log(error);
        }
    });
}

function removeFriend(friendId) {
   
    var userId = getCookie("userId");

    $.ajax({
        url: '/api/WebApi/RemoveFriend',
        method: 'POST',
        data: { UserId: userId, FollowerId: friendId },
        success: function (response) {
            console.log('Friend removed successfully');
            FriendList();
        },
        error: function (error) {
            console.log(error);
        }
    });
}



function confirmFriendRequest(userId) {
   
    var currentUserId = getCookie("userId");

    $.ajax({
        url: '/api/WebApi/ConfirmFriendRequest',
        method: 'POST',
        data: {
            userId: currentUserId,
            followerId: userId
        },
        success: function (data) {
            console.log('added');
            FriendList();
        },
        error: function (error) {
            console.log(error);
        }
    });
}



function fetchConfirmFriend() {
    var userId = getCookie("userId");

    $.ajax({
        url: '/api/WebApi/GetUserData/' + userId,
        type: 'GET',
        success: function (response) {
            $('#acceptUserList').empty();
            response.forEach(function (user) {
                if (user.RequestStatus == "accepted") {
                   
                    loadUserPosts(user.UserId);

                    // Render friend list
                    var request = `<li>
                        <div style="display: flex;justify-content: space-between;">
                            <figure>
                                <img src="${user.ProfilePhoto}" onclick="ShowFriendProfile(${user.UserId})" class="media-object pull-left" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" alt="Profile Photo">
                            </figure>
                            <div style="display: inline;">
                                <i>${user.FirstName} ${user.LastName}</i>
                                <i hidden>${user.UserId}</i>
                            </div>
                        </div>
                    </li>`
                    $('#acceptUserList').append(request);
                }
            });
        },
        error: function (xhr, status, error) {
            console.log('Error fetching friends:', error);
        }
    });
}





function commentreplay() {
    console.log("comment");
}



//Notifications Like, Comment,etc
function displayNotifications() {
   
    var userId = getCookie("userId");

    $.ajax({
        url: '/api/WebApi/notifications/' + userId,
        method: 'GET',
        success: function (data) {
            console.log("got notification data:", data);
            var notificationsHtml = '';
            data.forEach(function (notification) {
                notificationsHtml += `
                    <div class="notification-box">
                        <div class="notifi-meta">
                            <img src="${notification.ProfilePhoto}" alt="" width="52" height="52" style="float: left; border-radius: 50%;">
                            ${notification.PostPhoto ?
                        (notification.PostPhoto.endsWith('.mp4') ?
                            `<video width="52" height="52" controls style="float: right; border-radius: 50%;"><source src="${notification.PostPhoto}" type="video/mp4">Your browser does not support the video tag.</video>` :
                            `<img src="${notification.PostPhoto}" alt="" width="52" height="52" style="float: right; border-radius: 50%;">`) :
                        `<p style="float: right; border-radius: 50%; width: 52px; height: 52px; display: flex; align-items: center; justify-content: center; background: #f0f0f0;">${notification.PostContent}</p>`}
                            <p>${notification.NotificationText}</p>
                            <span>${new Date(notification.NotificationTimestamp).toLocaleString()}</span>
                            <input type="hidden" class="post-id" value="${notification.PostId}">
                        </div>
                    </div>`;
            });

            $('#notification-menu').html(notificationsHtml);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching notifications:", error);
        }
    });
}


$(document).ready(function () {
    // Click event for notification link
    $('#notificationLink').click(function (event) {
        event.preventDefault();
        displayNotifications();
    });
});

$("#submitButton").click(function () {
    var postContent = $("#postContent").val().trim();
    if (postContent === "") {
        $("#postContent").addClass("invalid");
        return false; // Prevent form submission
    }
});


$(document).ready(function () {

    $('#notificationLink').click(function (event) {
        event.preventDefault();

        // Toggle slide effect to show/hide notification container
        $('#notificationContainer').slideToggle('fast');
    });
});



$(document).ready(function () {
    $('#notificationLink').on('click', function (e) {
        e.preventDefault();
        displayNotifications();
    });

    $('#bookmarkLink').on('click', function (e) {
        e.preventDefault();
        displayNotifications();
    });

    $('#homeLink').on('click', function (e) {
        e.preventDefault();
        $('.central-meta').hide();
    });

    $('#notificationLink').on('click', function (e) {
        e.preventDefault();
        $('notificationLink').hide();
    });

    $('#notificationLink').on('click', function (e) {
        e.preventDefault();

        $('.notifications').toggle();
    });
});




function populateUserData(userId) {
  
    var userId = getCookie("userId");

    $.ajax({
        url: '/api/WebApi/' + userId,
        dataType: 'json',
        type: 'GET',
        success: function (response) {
            var userData = response;
            sessionStorage.setItem('Username', response.FirstName + " " + response.LastName);
            sessionStorage.setItem('ProfilePhoto', userData.ProfilePhoto);
          
            $('#UserName').html(userData.FirstName + " " + userData.LastName);

            $('#City').html('<i class="fa-solid fa-city"></i> ' + userData.City);
            $('#PhoneNumber').html('<i class="fa-solid fa-phone"></i> ' + userData.PhoneNumber);
            $('#Email').html('<i class="fa-solid fa-envelope"></i> ' + userData.Email);
            $('#interestdata').append('<li>' + userData.Interests + ' </li>');
            $('#BioInfo').append('<li>' + userData.Bio + ' </li>');

            

            var profilePhoto = userData.ProfilePhoto ? userData.ProfilePhoto : '~/images/profile.png';
            $('#ProfilePhoto').attr("src", profilePhoto);



            $('#TxtUserId').val(userData.UserId);
            $('#TxtLastName').val(userData.LastName);
            $('#TxtFirstName').val(userData.FirstName);
            $('#TxtCity').val(userData.City);
            $('#TxtEmail').val(userData.Email);
            $('#TxtBio').val(userData.bio);
            $('#TxtPhoneNumber').val(userData.PhoneNumber);
            $('#TxtBio').val(userData.Bio);
            $('#TxtUserPassword').val(userData.UserPassword);
            $('#gender').val(userData.Gender);
            $('#Interests').val(userData.Interests);
            //show Gender db value
            if (userData.Gender === 'Male') {
                $('#inlineRadio1').prop('checked', true);
            } else if (userData.Gender === 'Female') {
                $('#inlineRadio2').prop('checked', true);
            }
            //show interests db value
            var interests = userData.Interests.split(', ');
            $("input[name='Interests']").prop('checked', false);
            interests.forEach(function (interest) {
                $("input[name='Interests'][value='" + interest + "']").prop('checked', true);
            });
            //show brithdate db value
            var birthDate = new Date(userData.BirthDate);
            var year = birthDate.getFullYear();
            var month = String(birthDate.getMonth() + 1).padStart(2, '0');
            var day = String(birthDate.getDate()).padStart(2, '0');
            var formattedBirthDate = `${year}-${month}-${day}`;
            $('#BirthDate').val(formattedBirthDate);
        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch user data", error);
        }
    });
}



// Update User Profile
function updateUserInfo() {
    const Interests = [];
    const checkboxes = $("input[name='Interests']:checked");

    checkboxes.each(function () {
        Interests.push($(this).val());
    });

    var userData = {
        UserId: $('#TxtUserId').val(),
        LastName: $('#TxtLastName').val(),
        FirstName: $('#TxtFirstName').val(),
        City: $('#TxtCity').val(),
        Email: $('#TxtEmail').val(),
        PhoneNumber: $('#TxtPhoneNumber').val(),
        Bio: $('#TxtBio').val(),
        UserPassword: $('#TxtUserPassword').val(),
        Gender: $("input[name='gender']:checked").val(),
        Interests: Interests.join(', '),
        BirthDate: $('#BirthDate').val()
    };

    var userId = userData.UserId;
    var email = userData.Email;
    var phoneNumber = userData.PhoneNumber;


    // Check if the email is already in use
    $.ajax({
        url: '/api/WebApi/CheckEmail',
        method: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ UserId: userId, Email: email }),
        success: function (response) {
            if (response.emailInUse) {
                $('#emailError').text('Email already entered.').show();
            } else {
                $.ajax({
                    url: '/api/WebApi/' + userId,
                    method: 'PUT',
                    contentType: 'application/json',
                    data: JSON.stringify(userData),
                    success: function (response) {
                        console.log('User information updated successfully');
                        $('#emailError').hide();

                        window.location.href = '/Login/HomePage';
                    },
                    error: function (xhr, status, error) {
                        console.error('Error updating user information:', error);
                    }
                });
            }
        },
        error: function (xhr, status, error) {
            console.error('Error checking email:', error);
        }
    });
}



// change Password
function changePassword() {
    var newPassword = document.getElementById('input').value;
    var currentPassword = document.getElementById('currentPassword').value;

    $.ajax({
        url: '/api/changePassword',
        method: 'POST',
        data: {
            newPassword: newPassword,
            currentPassword: currentPassword
        },
        success: function (response) {
            console.log('Password changed successfully');
        },
        error: function (xhr, status, error) {
            console.error('Error changing password:', error);
        }
    });
}


function uploadProfilePhoto() {
   
    var userId = getCookie("userId");

    var formData = new FormData();
    var fileInput = document.getElementById('fileInput');
    if (fileInput.files.length > 0) {
        formData.append('profilePhoto', fileInput.files[0]);
        $.ajax({
            url: '/api/WebApi/uploadprofilephoto/' + userId,
            type: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                $('#ProfilePhoto').attr('src', response.ProfilePhoto);
                alert('Profile photo uploaded successfully!');
            },
            error: function (error) {
                console.log(error);
            }
        });
    } else {
        alert('Please select a file');
    }
}



function ShowFriendProfile(id) {   
    event.preventDefault();
   
    var userId = id;
    console.log("clicked");
    $.ajax({
        url: '/api/WebApi/' + userId,
        method: "GET",
        data: { userId: userId },
        success: function (response) {
            sessionStorage.setItem('UserProfileId', response.UserId);
            window.location.href = "/Login/UserProfile";
        },
        error: function (xhr, status, error) {
            console.error("Error fetching user data:", error);
        }
    });
}




function AddPosts(post) {
    var postHTML = '<li class="post-item" data-post-id="' + post.PostId + '">';

    if (post.PostPhoto) {
        // Check if the PostPhoto field contains a video URL or a photo URL
        if (post.PostPhoto.endsWith('.mp4')) {
            postHTML += '<video width="212" height="212" controls><source src="' + post.PostPhoto + '" type="video/mp4">Your browser does not support the video tag.</video>';
        } else {
            postHTML += '<img src="' + post.PostPhoto + '" alt="Post photo" height="212" width="212">';
        }
    } else if (post.PostContent) {
        postHTML += '<p>' + post.PostContent + '</p>';
    }

    postHTML += '<span class="post-icon"><i class="fa-regular fa-bookmark"></i></span>';
    postHTML += '</li>';

    var postElement = $(postHTML);
    postElement.find('.post-icon').click(function () {
        handlearchievepost($(this).closest('.post-item').data('post-id'));
    });

    return postElement;
}



function loadUserPostsHomePage() {
  
    var userId = getCookie("userId");
    $.ajax({
        url: '/api/WebApi/UserPosts1/' + userId,
        method: 'GET',
        success: function (data) {
            $('#UserPostDiv ul.photos').empty();
            data.reverse().forEach(function (post) {
                if (post.Status === 1 || post.Status === 2 || post.UserId !== parseInt(userId)) {
                    return;
                } else {
                    var postElement = AddPosts(post);
                    $('#UserPostDiv ul.photos').append(postElement);
                }
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}



function archievepost(post) {
    var postHTML = '<li class="post-item" data-post-id="' + post.PostId + '">';

    if (post.PostPhoto) {
        if (post.PostPhoto.endsWith('.mp4')) {
            postHTML += '<video width="212" height="212" controls><source src="' + post.PostPhoto + '" type="video/mp4">Your browser does not support the video tag.</video>';
        } else {
            postHTML += '<img src="' + post.PostPhoto + '" alt="Post photo" height="212" width="212">';
        }
    } else if (post.PostContent) {
        postHTML += '<p>' + post.PostContent + '</p>';
    }

    postHTML += '<span class="post-icon"><i class="fa-solid fa-bookmark"></i></span>';
    postHTML += '</li>';

    var postElement = $(postHTML);
    postElement.find('.post-icon').click(function () {
        handlearchievepost($(this).closest('.post-item').data('post-id'));
    });

    return postElement;
}



function loadarchievepost() {
    var userId = getCookie("userId");
    $.ajax({
        url: '/api/WebApi/UserPosts1/' + userId,
        method: 'GET',
        success: function (data) {
            $('#archieveDiv ul.photos').empty();
            data.reverse().forEach(function (post) {
                if (post.UserId == userId) {
                    if (post.Status == "2") {
                        var postElement = archievepost(post);
                        $('#archieveDiv ul.photos').append(postElement);
                    }
                }
            });
        },
        error: function (error) {
            console.log(error);
        }
    });
}




function handlearchievepost(postId) {
    console.log("Post ID:", postId);
    $('#archieveDiv ul.photos').empty();
    var postElement = $('[data-post-id="' + postId + '"]');
    var apiUrl;
    var successMessage;
    if (postElement.closest('#UserPostDiv').length > 0) {
        apiUrl = '/api/WebApi/addarchievepost/' + postId;
        successMessage = "removearchievepost";
    } else if (postElement.closest('#archieveDiv').length > 0) {
        apiUrl = '/api/WebApi/removearchievepost/' + postId;
        successMessage = "archievepost";
    } else {
        console.log("Post element not found in either container");
        return;
    }
    $.ajax({
        url: apiUrl,
        method: 'PUT',
        success: function (data) {
            console.log(successMessage);
            postElement.hide();
        },
        error: function (error) {
            console.log(error);
        }
    });
}





