interface PlaylistIdPage {
  params : {
    playlistId : number;
  }
}

const playlistPage = async ({params} : PlaylistIdPage) => {
  return (
    <div>
      playlist id : {params.playlistId}
    </div>
  )
}

export default playlistPage