$(document).ready(function () {
    const userId = sessionStorage.getItem('UserProfileId');

    console.log(userId);

    if (userId == null) {
        if (window.location.pathname === "/Login/UserProfile") {
            window.location.href = "/Login/Login";
        }
    } else {
        console.log('User ID:', userId);
    }

    loadUserPosts();
    populateUserData(userId);
    FriendList();



    $("#home-element").click(function () {
        $('.loadMore').show();
        $('.central-meta').show();
        $('#notification-menu').hide();
    });

    $("#logoutButton").click(function () {
        sessionStorage.clear();
        window.location.href = "/Login/Login";
    });




    $('#followers-Link').click(function () {
        fetchConfirmFriend();
        $('#timelineDiv').hide();
        $('#editinfoDiv').hide();
        $('#changepasswordDiv').hide();
        $('#acceptedFollowerDiv').show();
        $('#followingDiv').hide();
        $('#followingDiv').hide();
        $('#postDiv').hide();
        $('#archieveDiv').hide();

        $('#timelineLink').removeClass('active');
        $('#editinfoLink').removeClass('active');
        $('#changePasswordLink').removeClass('active');
        $('#followers-Link').addClass('active');
        $('#followingLink').removeClass('active');
        $('#postLink').removeClass('active');
        $('#archieveLink').removeClass('active');

    });



    $('#post-link').click(function () {
     
        $('#timeline-div').hide();
        $('#editinfo-div').hide();
        $('#changepassword-div').hide();
        $('#accepted-follower-div').hide();
        $('#following-div').hide();
        $('#timeline-div').hide();
        $('#postDiv').show();
        $('#archieve-div').hide();

        $('#timeline-link').removeClass('active');
        $('#editinfo-link').removeClass('active');
        $('#changepassword-link').removeClass('active');
        $('#followers-link').removeClass('active');
        $('#following-link').removeClass('active');
        $('#post-link').addClass('active');
        $('#archievelink').removeClass('active');
    });




    $('#timeline-link').click(function () {
        $('#timeline-div').show();
        $('#editinfo-div').hide();
        $('#changepassword-div').hide();
        $('#followers-div').hide();
        $('#following-div').hide();
        $('#accepted-follower-div').show();
        $('#postDiv').hide();
        $('#archieve-div').hide();


        $('#editinfo-link').removeClass('active');
        $('#timeline-link').addClass('active');
        $('#changepassword-link').removeClass('active');
        $('#followers-link').removeClass('active');
        $('#following-link').removeClass('active');
        $('#post-link').removeClass('active');
        $('#archievelink').removeClass('active');
    });
});


function populateUserData(userId) {
   
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

        },
        error: function (xhr, status, error) {
            console.error("Failed to fetch user data", error);
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

    postHTML += '</li>';
    var postElement = $(postHTML);
    postElement.find('.post-icon').click(function () {
        handlearchievepost($(this).closest('.post-item').data('post-id'));
    });

    return postElement;
}


function loadUserPosts() {
    var userId = sessionStorage.getItem('UserProfileId');

    $.ajax({
        url: '/api/WebApi/UserPosts/' + userId,
        method: 'GET',
        success: function (data) {
            var postsHTML = '';

            data.reverse().forEach(function (post) {
                if (post.UserId == userId) {
                    if (post.Status != 1) {
                        postsHTML += AddPost(post);
                    }
                }
            });
           
            $('#UserProfileDiv ul.photos').html(postsHTML);
        },
        error: function (error) {
            console.log(error);
        }
    });
}




function FriendList() {
    const userId = sessionStorage.getItem('UserProfileId');

    $.ajax({
        url: '/api/WebApi/GetUserData/' + userId,
        method: 'GET',
        success: function (data) {
            var peopleList = $('.friendz-list');
            peopleList.empty();
            data.forEach(friend => {
                if (friend.RequestStatus === 'accepted') {
                    friendcount++;
                    nearbyContct.append(GetFriend(friend));
                }
            });
            $('.friendz-list').click(ShowFriendProfile);
        },
        error: function (error) {
            console.log('Error fetching friend list:', error);
        }
    });
}