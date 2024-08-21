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
    FriendList(userId);

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
        FriendList(userId);
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

    // Event delegation for dynamically added profile photos
    $(document).on('click', '.profile-photo', function () {
        const friendId = $(this).data('friend-id');
        ShowFriendProfile(friendId);
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
        /*    $('#Email').html('<i class="fa-solid fa-envelope"></i> ' + userData.Email);*/

            $('#interestdata').empty();
            $('#BioInfo').empty();

            if (userData.Interests) {
                var uniqueInterests = Array.from(new Set(userData.Interests.split(','))).map(interest => interest.trim());
                uniqueInterests.forEach(interest => {
                    $('#interestdata').append('<li>' + interest + '</li>');
                });
            }

            if (userData.Bio) {
                var uniqueBio = Array.from(new Set(userData.Bio.split(','))).map(bio => bio.trim());
                uniqueBio.forEach(bioItem => {
                    $('#BioInfo').append('<li>' + bioItem + '</li>');
                });
            }

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



function FriendList(userId) {
    var authToken = getCookie("authToken");

    $.ajax({
        url: '/api/WebApi/GetUserData/' + userId,
        method: 'GET',
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
        success: function (data) {
            console.log('Friend list data:', data); // Debugging statement
            var peopleList = $('#acceptUserList'); // Make sure this is the correct selector
            peopleList.empty();

            if (Array.isArray(data)) {
                data.forEach(friend => {
                    if (friend.RequestStatus === 'accepted' && friend.UserId !== userId) {
                        peopleList.append(GetFriend(friend));
                    }
                });
            } else {
                console.error('Unexpected data format:', data); // Debugging statement
            }
        },
        error: function (error) {
            console.log('Error fetching friend list:', error);
        }
    });
}

function GetFriend(friend) {
    return `
        <div class="friend-item" style="display: flex; align-items: center; gap: 10px; padding: 5px; border-bottom: 1px solid #ddd;">
            <figure style="margin: 0;">
                <img src="${friend.ProfilePhoto}" class="profile-photo" data-friend-id="${friend.UserId}" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; cursor: pointer;" alt="Profile Photo" onclick="ShowFriendProfile(${friend.UserId})" />
            </figure>
            <span onclick="ShowFriendProfile(${friend.UserId})" style="cursor: pointer;">${friend.FirstName + ' ' + friend.LastName}</span>
        </div>
    `;
}

function ShowFriendProfile(id) {
    event.preventDefault();

    var userId = id;
    var authToken = getCookie("authToken");

    $.ajax({
        url: '/api/WebApi/' + userId,
        method: "GET",
        beforeSend: function (xhr) {
            xhr.setRequestHeader("Authorization", "Basic " + authToken);
        },
        success: function (response) {

            sessionStorage.setItem('UserProfileId', response.UserId);
            loadUserPosts();
            populateUserData(response.UserId);
            FriendList(response.UserId);
        },
        error: function (xhr, status, error) {
            console.error("Error fetching user data:", error);
        }
    });
}
