var CustomPlaylistSettings = {

  playlistID: null,

  playlistName: null,

  init: function (options) {
    $.extend(CustomPlaylistSettings, options);
    $('#playlist-name').val(CustomPlaylistSettings.playlistName);
  },

  destroy: function () {
    $.ajax({
      type: 'DELETE',
      url: '/playlists/' + CustomPlaylistSettings.playlistID,
      success: function () {
        CustomPlaylistSettings.destroyDone();
      }
    });
  },

  destroyDone: function () {
    $('#playlists-main #' + CustomPlaylistSettings.playlistID).remove();

    if ($('#playlists-main li').length == 0) {
      var noPlaylistsSpan = $('<span>').attr('id', 'no-playlists')
                                       .text('Looks like you currently have 0 playlists, starting using tubalr and click the playlist dropdown under the video player to get started!');

      $('#playlists-main ul').replaceWith(noPlaylistsSpan);
    }

    CustomPlaylistSettings.notice('Your playlist, <b>' + CustomPlaylistSettings.playlistName + '</b>, has been successfully deleted.');

    $('#custom-playlist-settings').dialog('close');
  },

  rename: function () {
    var newPlaylistName = $('#playlist-name').val().replace(/[^a-z\d ]/ig,"");

    if (newPlaylistName.toLowerCase() == CustomPlaylistSettings.playlistName.toLowerCase()) {
      return false;
    }

    $.ajax({
      type: 'PUT',
      url: '/playlists/' + CustomPlaylistSettings.playlistID,
      data: {
        id:   CustomPlaylistSettings.playlistID,
        name: newPlaylistName
      },
      success: function (data) {
        if (data.name_taken) {
          CustomPlaylistSettings.playlistNameTaken(newPlaylistName);
        }
        else {
          CustomPlaylistSettings.renameDone(newPlaylistName);
        }
      }
    });
  },

  playlistNameTaken: function (failedName) {
    CustomPlaylistSettings.notice('You already have a playlist named <b>' + failedName + '</b>.');

    $('#custom-playlist-settings').dialog('close');
  },

  renameDone: function (newPlaylistName) {
    var playlistLI = $('.playlists-tab-content .list #' + CustomPlaylistSettings.playlistID);

    playlistLI.data('playlist-name', newPlaylistName)
              .find('a').text(newPlaylistName);

    CustomPlaylistSettings.notice('<b>' + CustomPlaylistSettings.playlistName + '</b>, renamed to <b>' + newPlaylistName + '</b>.');

    $('#custom-playlist-settings').dialog('close');
  },

  notice: function (message) {
    $('#notices').append('<aside class="playlist-settings-notice">' + message+ '</aside>');

    setTimeout(function () {
      $('.playlist-settings-notice').slideUp(500, function () {
        $(this).remove();
      });
    }, 5000);
  }

};

$(document).ready(function () {

  $('#custom-playlist-settings').dialog({
    modal:      true,
    autoOpen:   false,
    width:      400,
    draggable:  false,
    title:      'Playlist Settings'
  });

  $('.custom-playlist-settings-open-dialog').click(function () {
    CustomPlaylistSettings.init({
      playlistID:   $(this).parent().attr('id'),
      playlistName: $(this).parent().data('playlist-name')
    });

    $('#custom-playlist-settings').dialog('open');
  });

  $('#delete-playlist').click(function () {
    var areYouSure = confirm('Are you sure you want to delete your "' + CustomPlaylistSettings.playlistName + '"" playlist?');

    if (areYouSure) {
      CustomPlaylistSettings.destroy();
    }
  });

  $('#save-playlist-name').click(function () {
    CustomPlaylistSettings.rename();
  });

});