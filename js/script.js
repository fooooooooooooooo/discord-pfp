/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
$('#fetch-user-button').click(function () {
    let id = $("#user-input-field").val();

    $.get(`https://discord-pfp.herokuapp.com/api?id=${id}`, function (data, status) {
        $('#the-box').removeClass('is-hidden');
        $('.main-container').css('margin-top', '1vh');
        $("html, body").animate({ scrollTop: 0 }, "slow");
        $('#user-avatar').attr('src', data.avatar);
        $('#user-name').text(data.username);
        $('#user-discriminator').text(`#${data.discriminator}`);
        $('#user-id').text(id);
        $('#badges-container').html(constructBadges(getFlagArray(data.public_flags)));

        console.log(data);
    });
});

function getFlagArray(flagInt) {
    const flags = [
        'None',
        'Discord Employee',
        'Discord Partner',
        'HypeSquad Events',
        'Bug Hunter Level 1',
        '',
        '',
        'House Bravery',
        'House Brilliance',
        'House Balance',
        'Early Supporter',
        'Team User',
        '',
        'System',
        '',
        'Bug Hunter Level 2',
        '',
        'Verified Bot',
        'Verified Bot Developer'
    ]

    let returnFlags = [];

    for (let i = 0; i < flags.length; i++) {
        const flag = flags[i + 1];
        if (flag === '')
            continue;
        if ((flagInt & 1 << i) !== 0)
            returnFlags.push(flag);
    }

    if (returnFlags.length === 0)
        returnFlags.push(flags[0]);

    return returnFlags;
}

function constructBadges(flagsArray) {
    let html = '';

    flagsArray.forEach(flag => {
        if (flag === 'None') {
            return;
        }
        html += `<div class="column is-narrow"><div class="profile-badge-wrapper">${prefabs[flag]}</div></div>`;
    });

    return html;
}
const prefabs = {
    'Discord Employee':
        '<div class="profile-badge profile-badge-discord-staff" data-tooltip="Discord Staff"></div>',
    'Discord Partner':
        '<div class="profile-badge profile-badge-discord-partner" data-tooltip="Discord Partner">',
    'HypeSquad Events':
        '<div class="profile-badge profile-badge-hypesquad-events" data-tooltip="Hypesquad Events"></div>',
    'Bug Hunter Level 1':
        '<div class="profile-badge profile-badge-bug-hunter-level-1" data-tooltip="Bug Hunter Level 1"></div>',
    'House Bravery':
        '<div class="profile-badge profile-badge-hypesquad-bravery" data-tooltip="Hypesquad Bravery"></div>',
    'House Brilliance':
        '<div class="profile-badge profile-badge-hypesquad-brilliance" data-tooltip="Hypesquad Brilliance"></div>',
    'House Balance':
        '<div class="profile-badge profile-badge-hypesquad-balance" data-tooltip="Hypesquad Balance"></div>',
    'Early Supporter':
        '<div class="profile-badge profile-badge-early-supporter" data-tooltip="Early Supporter"></div>',
    'Team User':
        '',
    'System':
        '<span class="bot-tag" data-tooltip="Verified Bot"><svg aria-label="Verified System" class="bot-tag-verified" aria-hidden="false" width="16" height="16" viewBox="0 0 16 15.2"> <path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" fill="currentColor" ></path></svg> <span class="bot-tag-text">SYSTEM</span></span >',
    'Bug Hunter Level 2':
        '<div class="profile-badge profile-badge-bug-hunter-level-2" data-tooltip="Bug Hunter Level 2"></div>',
    'Verified Bot':
        '<span class="bot-tag" data-tooltip="Verified Bot"><svg aria-label="Verified Bot" class="bot-tag-verified" aria-hidden="false" width="16" height="16" viewBox="0 0 16 15.2" > <path d="M7.4,11.17,4,8.62,5,7.26l2,1.53L10.64,4l1.36,1Z" fill="currentColor"></path> </svg > <span class="bot-tag-text">BOT</span></span >',
    'Verified Bot Developer':
        '<div class="profile-badge profile-badge-verified-bot-developer" data-tooltip="Verified Bot Developer"></div>'
}