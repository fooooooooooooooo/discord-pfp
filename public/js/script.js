/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

$('#fetch-user-button').click(function () {
    let id = $("#user-input-field").val();

    $.get(`/api?id=${id}`, function (data, status) {
        $('#the-box').removeClass('is-hidden');
        $('#user-avatar').attr('src', data.avatar);
        $('#user-name').html(`${data.username}<span id="user-discriminator" class="subtitle is-6"></span>`);
        $('#user-discriminator').text(`#${data.discriminator}`);
        $('#user-id').text(id);
        console.log(data);
    });
});

