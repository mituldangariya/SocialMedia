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
        setCookie('userId', 0, -1);
        location.reload();
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
        $('#editinfoLink').addClass('active');
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


function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
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
            <video id="postVideo" height="100%" width="90%" style="object-fit: cover;" controls>
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

    // Add styles to hide video controls
    const style = document.createElement('style');
    style.innerHTML = `
                video::-webk    it-media-controls-volume-slider,
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


    

    var postHTML = `
    <div class="central-meta item">
        <div class="user-post">
            <div class="friend-info">
                <figure>
                    <img src="${post.ProfilePhoto}" alt="" height="54" width="54" id="ProfilePhoto" class="zoomable">
                </figure>
                <div class="friend-name">
                    ${post.UserId == userId ? `<i class="fas fa-ellipsis-h more-icon" data-toggle="tooltip" title="More"></i>` : ''}
                    <ins onclick="ShowFriendProfile(${post.UserId})" style="cursor: pointer">${post.FirstName} ${post.LastName}</ins>
                    <span hidden>${post.UserId}</span>
                    <button class="delete-btn" onClick="deletePost(${post.PostId})"> <i class="fas fa-trash"></i></button>
                    <span>Published: ${post.PostDate}</span>
                </div>
            </div>
            <div class="description">
                <b>${post.PostContent}</b>
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
                            <span class="comment" data-toggle="tooltip" title="comment" onclick="toggleComments(this, ${post.PostId})" style="cursor: pointer;">
                                <i class="fa fa-comments-o"></i>
                                <ins>${post.CommentCount}</ins>
                            </span>
                        </li>
                    </ul>
                </div>
                <div class="comment-area" style="display: none;">
                    <div class="post-comt-box">
                        <textarea id="commentTextarea" placeholder="Post your comment" maxlength="60" onchange="commentlenght()"></textarea>
                      <button class="btn-primary" id="Postbtn" style="font-size: 17px;">Comment</button>

                        <span id="commenterror" hidden>Please enter a comment.</span>
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



document.addEventListener('click', function (event) {
    if (event.target && event.target.id === 'Postbtn') {
        var commentTextarea = document.getElementById('commentTextarea');
        var commentError = document.getElementById('commenterror');

        if (commentTextarea.value.trim() === '') {
            commentError.hidden = false;
            commentTextarea.style.border = '1px solid red';
        } else {
            commentError.hidden = true;
            commentTextarea.style.border = '';
            // Add your logic to post the comment here
        }
    }
});

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
    var authToken = getCookie("authToken");


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
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
        data: formData,
        contentType: false,
        processData: false,
        success: function (data) {
            console.log("Post Added", data);
            $("#userpost").val("");
            $("#postContent").val("");

            $.ajax({
                url: '/api/WebApi/GetLastPost',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + authToken);
                },
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
                            beforeSend: function (xhr) {
                                xhr.setRequestHeader("Authorization", "Basic " + authToken);
                            },
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
    var authToken = getCookie("authToken");
    $.ajax({
        url: '/api/WebApi/UserPosts/' + userId,
        method: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
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
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "Basic " + authToken);
                    },
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

            $('.friend-name').click(function (event) {
                event.preventDefault(); // Prevent default action for the click event

                var userId = $(this).data('id');
                ShowFriendProfile(userId);
            });
            $('.post-comt-box button').click(UploadComment);
        },
        error: function (error) {
            console.log(error);
        }
    });
}






//Post Delete


function deletePost(postId) {
    var authToken = getCookie("authToken");

    Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to delete this Post?!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    }).then((result) => {
        if (result.isConfirmed) {
            $.ajax({
                url: '/api/WebApi/Deletepost/' + postId,
                method: 'PUT',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + authToken);
                },
                success: function (data) {
                    $(`.like-button[data-post-id="${postId}"]`).closest('.central-meta.item').hide();
                    Swal.fire(
                        'Deleted!',
                        'Your post has been deleted.',
                        'success'
                    );
                },
                error: function (error) {
                    console.error("Error deleting post:", error);
                    Swal.fire(
                        'Error!',
                        'There was an issue deleting your post.',
                        'error'
                    );
                }
            });
        } else {
            Swal.fire(
                'Cancelled',
                'Your post is safe :)',
                'info'
            );
        }
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
    var authToken = getCookie("authToken");

    $.ajax({
        url: `/api/WebApi/UserProfile?userId=${userId}`,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
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




function addCommentReply(replyText, postId, parentCommentId, userId) {
    var UserName = sessionStorage.getItem('Username');
    var ProfilePhoto = sessionStorage.getItem('ProfilePhoto');
    var authToken = getCookie("authToken");

    $.ajax({
        url: '/api/WebApi/AddComment',
        method: 'POST',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
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
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + authToken);
                },
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



function loadPostComments(postId, $commentsList) {
    var userId = getCookie("userId");
    var authToken = getCookie("authToken");

    $.ajax({
        url: '/api/WebApi/GetPostComments/' + postId,
        method: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
        success: function (comments) {
            $commentsList.empty();

            if (comments.length === 0) {
                // $commentsList.append('<li id="NoComments">No comments yet.</li>');
            } else {
                var commentsMap = {};

                // Create comments and map them by ID
                comments.forEach(function (comment) {
                    const uniqueModalId = 'replyModal-' + comment.CommentId;
                    const commentHtml = `
                    <li data-comment-id="${comment.Id}" data-parent-comment-id="${comment.ParentCommentId}">
                        <div class="comet-avatar">
                            <img src="${comment.ProfilePhoto}" alt="" height="40" width="40" id="ProfilePhoto">
                        </div>
                        <div class="we-comment">
                            <div class="coment-head">
                                <h5>${comment.UserName}</h5>
                                <span hidden>${comment.CommentId}</span>
                                <span>${comment.CommentDate}</span>
                                    <i class="fa-solid fa-share reply-icon" data-modal-id="${uniqueModalId}" style="cursor: pointer;"></i>
                                ${comment.UserId == userId ? `
                                <div class="comment-options">
                                    <button class="delete-comment-btn custom-style" onclick="deleteComment(${comment.CommentId}, $(this).closest('li'))">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>` : ''}
                            </div>
                            <p>${comment.CommentText}</p>
                        </div>
                        <ul class="replies"></ul>
                        <div class="modal" id="${uniqueModalId}">
                            <div class="modal-content">
                                <span class="close">&times;</span>
                                <h3>Reply to Comment</h3>
                                <textarea class="replyText" placeholder="Enter your reply"></textarea>
                                <button class="btn btn-success submitReply" style="width:87px">Reply Comment</button>
                            </div>
                        </div>
                    </li>`;
                    commentsMap[comment.CommentId] = $(commentHtml);
                });

                // Append comments to the correct parent or to the root list
                comments.forEach(function (comment) {
                    if (comment.ParentCommentId) {
                        if (commentsMap[comment.ParentCommentId]) {
                            commentsMap[comment.ParentCommentId].find('.replies').first().append(commentsMap[comment.CommentId]);
                        }
                    } else {
                        $commentsList.append(commentsMap[comment.CommentId]);
                    }
                });

                // Bind click events
                $commentsList.find('.reply-icon').click(function () {
                    var modalId = $(this).data('modal-id');
                    replieComment($(this).closest('li').find('span[hidden]').text(), postId, modalId);
                });

                // Ensure only one modal is handled at a time
                $(document).on('click', '.close', function () {
                    $(this).closest('.modal').hide();
                });

                $(window).click(function (event) {
                    if ($(event.target).hasClass('modal')) {
                        $(event.target).hide();
                    }
                });
            }
        },
        error: function (error) {
            console.log(error);
        }
    });
}



function replieComment(commentId, postId, modalId) {
    var userId = getCookie("userId");
    var authToken = getCookie("authToken");

    var modal = document.querySelector("#" + modalId);
    var replyText = modal.querySelector(".replyText");
    var submitReply = modal.querySelector(".submitReply");
    var span = modal.querySelector(".close");

    if (!modal) {
        console.error("Modal with id '" + modalId + "' not found.");
        return;
    }

    modal.style.display = "block";

    span.onclick = function () {
        modal.style.display = "none";
        replyText.focus();
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
            replyText.focus();
        }
    }

    submitReply.onclick = function () {
        var replyTextValue = replyText.value.trim();
        if (replyTextValue !== '') {
            $.ajax({
                url: '/api/WebApi/AddComment',
                method: 'POST',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + authToken);
                },
                data: JSON.stringify({
                    postId: postId,
                    userId: userId,
                    commentText: replyTextValue,
                    ProfilePhoto: sessionStorage.getItem('ProfilePhoto'),
                    parentCommentId: commentId // Send ParentCommentId in the request
                }),
                contentType: 'application/json; charset=utf-8',
                success: function (reply) {
                    modal.style.display = "none";
                    replyText.value = "";

                    // Construct HTML for the new reply
                    var replyHtml = `
                    <li data-comment-id="${reply.CommentId}">
                        <div class="comet-avatar">
                            <img src="${reply.ProfilePhoto}" alt="" height="40" width="40" id="ProfilePhoto">
                        </div>
                        <div class="we-comment">
                            <div class="coment-head">
                                <h5>${reply.UserName}</h5>
                                <span>just now</span>
                            </div>
                            <p>${reply.CommentText}</p>
                        </div>
                    </li>`;

                    // Append the reply to the correct parent comment
                    var parentCommentLi = $(modal).closest('li');
                    parentCommentLi.find('.replies').append(replyHtml);

                    // Update the reply count
                    var $replyCount = parentCommentLi.find('.reply-count'); // Ensure this is the correct class or selector
                    var currentCount = parseInt($replyCount.text()) || 0;
                    $replyCount.text(currentCount + 1);
                },
                error: function (error) {
                    console.log(error);
                }
            });
        }
    }
}

//upload comment


function UploadComment() {
    var $form = $(this).closest('.post-comt-box');
    var postId = $form.closest('.central-meta').find('.like-button').data('post-id');
    var commentText = $form.find('textarea').val();

    var userId = getCookie("userId");
    var authToken = getCookie("authToken");
    var ProfilePhoto = sessionStorage.getItem('ProfilePhoto');

    if (commentText.trim() !== '') {
        $.ajax({
            url: '/api/WebApi/AddComment',
            method: 'POST',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + authToken);
            },
            data: { postId: postId, userId: userId, commentText: commentText, ProfilePhoto: ProfilePhoto },
            success: function () {
                $.ajax({
                    url: '/api/WebApi/GetLastComment',
                    type: 'GET',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "Basic " + authToken);
                    },
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
                                        ${comment.UserId == userId ? '<i class="fa-solid fa-share reply-icon" data-modal-id="${uniqueModalId}" style="cursor: pointer;"></i>' : ''}
                                        <div class="comment-options">
                                    <button class="delete-comment-btn custom-style" onclick="deleteComment(${comment.CommentId}, $(this).closest('li'))">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                        
                                    </div>
                                    <p>${comment.CommentText}</p>
                                </div>
                            </li>`;
                            $form.closest('.comment-area').find('.we-comet').prepend(commentHTML);

                            // Update comment count
                            var $commentCount = $form.closest('.central-meta').find('.comment ins');
                            var currentCount = parseInt($commentCount.text());
                            $commentCount.text(currentCount + 1);
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




function deleteComment(commentId, $commentElement, isReply = false) {
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
            var authToken = getCookie("authToken");

            $.ajax({
                url: '/api/WebApi/DeleteComment/' + commentId,
                type: 'DELETE',
                beforeSend: function (xhr) {
                    xhr.setRequestHeader("Authorization", "Basic " + authToken);
                },
                success: function () {
                    Swal.fire(
                        'Deleted!',
                        'Your comment has been deleted.',
                        'success'
                    );

                    // Remove the comment or reply element from the DOM
                    $commentElement.remove();

                    // Update the comment or reply count
                    if (isReply) {
                        // Update the reply count for the parent comment
                        var $parentComment = $commentElement.closest('li').closest('li');
                        var $replyCount = $parentComment.find('.reply-count');

                        if ($replyCount.length) {
                            var currentReplyCount = parseInt($replyCount.text(), 10);
                            if (!isNaN(currentReplyCount) && currentReplyCount > 0) {
                                $replyCount.text(currentReplyCount - 1);
                            }
                        }
                    } else {
                        // Update the main comment count for the post
                        var $commentCount = $commentElement.closest('.central-meta').find('.comment ins');

                        if ($commentCount.length) {
                            var currentCommentCount = parseInt($commentCount.text(), 10);
                            if (!isNaN(currentCommentCount) && currentCommentCount > 0) {
                                $commentCount.text(currentCommentCount - 1);
                            }
                        }
                    }

                    // If there are no comments or replies left, show "No comments yet."
                    if ($commentElement.closest('ul').children().length === 0) {
                        $commentElement.closest('ul').append('<li id="NoComments">No comments yet.</li>');
                    }
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





function FriendList() {
    var userId = getCookie("userId");
    var authToken = getCookie("authToken");

    $.ajax({
        url: '/api/WebApi/GetUserData/' + userId,
        method: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
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
                                <div style="display: inline; cursor: pointer;" onclick="ShowFriendProfile(${user.UserId})">
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

                // Event bindings for dynamic content
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
    var authToken = getCookie("authToken");

    $.ajax({
        url: '/api/WebApi/AddFriend',
        method: 'POST',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
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
    var authToken = getCookie("authToken");

    $.ajax({
        url: '/api/WebApi/RemoveFriend',
        method: 'POST',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
        data: { UserId: userId, FollowerId: friendId },
        success: function (response) {
            console.log('Friend removed successfully');
            // Remove the friend from the UI without page refresh
            $('li').has('button[data-user-id="' + friendId + '"]').remove();
        },
        error: function (error) {
            console.log(error);
        }
    });
}



function confirmFriendRequest(userId) {

    var currentUserId = getCookie("userId");
    var authToken = getCookie("authToken");
    $.ajax({
        url: '/api/WebApi/ConfirmFriendRequest',
        method: 'POST',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
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
    var authToken = getCookie("authToken");

    $.ajax({
        url: '/api/WebApi/GetUserData/' + userId,
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
        success: function (response) {
            $('#acceptUserList').empty();
            response.forEach(function (user) {
                if (user.RequestStatus === "accepted") {
                    loadUserPosts(user.UserId);

                    // Render friend list with a "Remove" button
                    var request = `
                    <li data-friend-id="${user.UserId}">
                       <div style="display: flex; justify-content: space-between; align-items: center;">
                        <figure>
                                  <img src="${user.ProfilePhoto}" onclick="ShowFriendProfile(${user.UserId})" class="media-object pull-left" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; cursor: pointer;" alt="Profile Photo">
                        </figure>

                         <div style="display: inline;">
                              <i onclick="ShowFriendProfile(${user.UserId})" style="cursor: pointer;">${user.FirstName} ${user.LastName}</i>
                              <i hidden>${user.UserId}</i>
                         </div>
                       <button class="btn btn-outline-danger remove-friend-btn" data-user-id="${user.UserId}">Remove</button>
                   </div>
                    </li>`;

                    $('#acceptUserList').append(request);
                }
            });

            // Bind click event for the "Remove" button
            $('.remove-friend-btn').click(function () {
                var friendUserId = $(this).data('user-id');
                removeFriend(friendUserId);
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
    var authToken = getCookie("authToken");

    $.ajax({
        url: '/api/WebApi/notifications/' + userId,
        method: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
        success: function (data) {
            // Start building the HTML for notifications
            var notificationsHtml = `
                <h1>Notifications</h1>
                <div class="notification-container">
            `;

            // Generate HTML for each notification
            data.forEach(function (notification) {
                notificationsHtml += `
                    <div class="notification-box border-bottom d-flex align-items-center p-3 bg-white mb-3">
                        <div class="row w-100">
                            <!-- Profile Photo Column -->
                            <div class="col-auto">
                                <div class="profile-photo-container" style="display: flex; justify-content: center; align-items: center;">
                                    <img src="${notification.ProfilePhoto}" alt="Profile Photo" style="width: 52px; height: 52px; border-radius: 50%;margin-top: 16px; border: 2px solid #ddd; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);">
                                </div>
                            </div>
                            
                            <!-- Notification Content Column -->
                            <div class="col">
                                <div class="notification-content">
                                    <p class="notification-text mb-1">${notification.NotificationText}</p>
                                    <span class="notification-timestamp text-muted" style="font-size: 14px;">
                                        ${new Date(notification.NotificationTimestamp).toLocaleString()}
                                    </span>
                                    <input type="hidden" class="post-id" value="${notification.PostId}">
                                </div>
                            </div>
                            
                            <!-- Post Media Column -->
                            <div class="col-auto">
                                ${notification.PostPhoto ?
                        (notification.PostPhoto.endsWith('.mp4') ?
                            `<video class="post-media rounded me-3" width="52" height="52" controls>
                                            <source src="${notification.PostPhoto}" type="video/mp4">
                                            Your browser does not support the video tag.
                                        </video>` :
                            `<img src="${notification.PostPhoto}" alt="Post Photo" class="post-media rounded me-3" width="52" height="52">`) :
                        `<p class="post-content d-flex align-items-center justify-content-center rounded bg-light text-center me-3" style="width: 52px; height: 52px; margin: 15px;">
                                        ${notification.PostContent}
                                    </p>`
                    }
                            </div>
                        </div>
                    </div>
                `;
            });

            // Insert the generated HTML into the DOM
            $('#notification-menu').html(notificationsHtml);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching notifications:", error);
            // Optionally, you could display a user-friendly message here
            $('#notification-menu').html('<p>Error fetching notifications. Please try again later.</p>');
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
    var authToken = getCookie("authToken");

    $.ajax({
        url: '/api/WebApi/' + userId,
        dataType: 'json',
        type: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
        success: function (response) {
            var userData = response;

            // Clear existing data to avoid duplication
            $('#interestdata').empty();
            $('#BioInfo').empty();

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

            // Update form fields with user data
            $('#TxtUserId').val(userData.UserId);
            $('#TxtLastName').val(userData.LastName);
            $('#TxtFirstName').val(userData.FirstName);
            $('#TxtCity').val(userData.City);
            $('#TxtEmail').val(userData.Email);
            $('#TxtBio').val(userData.Bio);
            $('#TxtPhoneNumber').val(userData.PhoneNumber);
            $('#TxtUserPassword').val(userData.UserPassword);
            $('#gender').val(userData.Gender);
            $('#Interests').val(userData.Interests);

            // Show Gender
            if (userData.Gender === 'Male') {
                $('#inlineRadio1').prop('checked', true);
            } else if (userData.Gender === 'Female') {
                $('#inlineRadio2').prop('checked', true);
            }

            // Show Interests
            var interests = userData.Interests.split(', ');
            $("input[name='Interests']").prop('checked', false);
            interests.forEach(function (interest) {
                $("input[name='Interests'][value='" + interest + "']").prop('checked', true);
            });

            // Show Birthdate
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
    var authToken = getCookie("authToken");


    // Check if the email is already in use
    $.ajax({
        url: '/api/WebApi/CheckEmail',
        method: 'POST',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
        contentType: 'application/json',
        data: JSON.stringify({ UserId: userId, Email: email }),
        success: function (response) {
            if (response.emailInUse) {
                $('#emailError').text('Email already entered.').show();
            } else {
                $.ajax({
                    url: '/api/WebApi/' + userId,
                    method: 'PUT',
                    beforeSend: function (xhr) {
                        xhr.setRequestHeader("Authorization", "Basic " + authToken);
                    },
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
    var authToken = getCookie("authToken");

    var formData = new FormData();
    var fileInput = document.getElementById('fileInput');
    if (fileInput.files.length > 0) {
        formData.append('profilePhoto', fileInput.files[0]);
        $.ajax({
            url: '/api/WebApi/uploadprofilephoto/' + userId,
            type: 'POST',
            beforeSend: function (xhr) {
                xhr.setRequestHeader("Authorization", "Basic " + authToken);
            },
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
    var authToken = getCookie("authToken");

    console.log("clicked");
    $.ajax({
        url: '/api/WebApi/' + userId,
        method: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
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
    var authToken = getCookie("authToken");

    $.ajax({
        url: '/api/WebApi/UserPosts1/' + userId,
        method: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
        success: function (data) {
            $('#UserPostDiv ul.photos').empty();
            data.reverse().forEach(function (post) {
                // Check if the post status is null (or 0) and the post belongs to the current user
                if ((post.Status === null || post.Status === 0) && post.UserId === parseInt(userId)) {
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
    var authToken = getCookie("authToken");
    $.ajax({
        url: '/api/WebApi/UserPosts1/' + userId,
        method: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
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

    var postElementInUserDiv = $('#UserPostDiv [data-post-id="' + postId + '"]');
    var postElementInArchieveDiv = $('#archieveDiv [data-post-id="' + postId + '"]');

    var postElement;
    var apiUrl;
    var successMessage;

    if (postElementInUserDiv.length > 0) {
        postElement = postElementInUserDiv;
        apiUrl = '/api/WebApi/addarchievepost/' + postId;
        successMessage = "Post moved to archive";
    } else if (postElementInArchieveDiv.length > 0) {
        postElement = postElementInArchieveDiv;
        apiUrl = '/api/WebApi/removearchievepost/' + postId;
        successMessage = "Post removed from archive";
    } else {
        console.log("Post element not found in either container");
        return;
    }

    $.ajax({
        url: apiUrl,
        method: 'PUT',
        beforeSend: function (xhr) {
            var authToken = getCookie("authToken");
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
        success: function (data) {
            console.log(successMessage);
            postElement.remove(); // Remove the post element from the DOM
        },
        error: function (error) {
            console.log("Error:", error);
        }
    });
}



