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


    $('#timeline-link').click(function () {
        $('#timeline-div').show();
        $('#acceptedFollowerDiv').hide();
        $('#postDiv').hide();

       
        $('#timeline-link').addClass('active');
        $('#followers-Link').removeClass('active');
        $('#post-link').removeClass('active');
       
    });


    $('#followers-Link').click(function () {
        fetchConfirmFriend();
        $('#timeline-div').hide();
        $('#acceptedFollowerDiv').show();
        $('#postDiv').hide();
       

        $('#timeline-link').removeClass('active');
        $('#followers-Link').addClass('active');
        $('#post-link').removeClass('active');
       

    });



    $('#post-link').click(function () {
     
        $('#timeline-div').hide();
        $('#acceptedFollowerDiv').hide();
        $('#postDiv').show();
       

        $('#timeline-link').removeClass('active');
        $('#followers-Link').removeClass('active');
        $('#post-link').addClass('active');
       
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


function populateUserData(userId) {
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
    var authToken = getCookie("authToken");

   // var userId = getCookie("userId");
    $.ajax({
        url: '/api/WebApi/UserPosts1/' + userId,
        method: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
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




function FriendList() {
    const userId = sessionStorage.getItem('UserProfileId');
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