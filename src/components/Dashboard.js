import React from 'react'
import ArtistGame from './ArtistGame'
import SongGame from './SongGame'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'

const styles = () => ({
  root: {
    height: 'inherit'
  },
  button: {
    backgroundColor: '#f03a47',
    border: 'none',
    height: '40px',
    width: '150px',
    borderRadius: '500px',
    fontFamily: 'GothamMedium',
    fontSize: '14px',
    color: '#e8ebed',
    transition: '.3s',
    position: 'absolute',
    bottom: '15px',
    right: '10px',
    "&:hover": {
        backgroundColor: '#f46771'
    },
    "&:focus": {
      backgroundColor: '#bf2e38'
    },
    "&:nth-child(3)":{
      bottom: '60px'
    },
    "&:nth-child(2)":{
      bottom: '105px'
    }
  },
  section: {
    backgroundColor: 'grey',
    flex: '1 0 40%',
    height: '65%',
    margin: '5px',
    marginTop: '180px',
    marginRight: '40px',
    marginLeft: '40px',
    position: 'relative',
    backgroundImage: 'linear-gradient(to top, #191414, rgba(255,0,0,0))',
    borderRadius: '20px',
    '@media only screen and (max-width:960px)': {
      flex: '1 0 95%',
      height: '50%',
      marginTop: '0%',
      marginRight: '0px',
      marginLeft: '0px',
      borderRadius: '0px',
      margin: '0px'
    }
    
  },
  container: {
    display: 'flex',
    height: 'calc(100% - 15px)',
    padding: '4px 4px 0 4px',
    flexWrap: 'wrap',
    '@media only screen and (max-width:960px)': {
      height: '100%',
      padding: '0',
    }
  },
  gameTitle: {
    position: 'absolute',
    bottom: '5px',
    left: '15px',
    color: '#e8ebed',
    fontSize: '75px',
    fontFamily: 'GothamBold',
    '@media only screen and (max-width:960px)': {
      fontSize: '55px',
    }
  },
  artistgame: {
    height: 'inherit'
  }
})

class Dashboard extends React.Component {

    constructor(props) {
      super(props)
      this.state = {
        expiryTime: '0',
        artistList: [],
        songList: [],
        gameStart: 'none',
        topArtist: '',
        topTrack: '',
        gameType: ''
      }
    }

    componentDidMount() {
      let expiryTime;
      const params = JSON.parse(localStorage.getItem('params'))
      fetch(`https://api.spotify.com/v1/me/top/artists?time_range=long_term&limit=1&offset=0`, {
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${params.access_token}`
          },
        })
        .then(response => response.json())
        .then(data => this.setState({topArtist: data.items[0].images[0].url}));

        fetch(`https://api.spotify.com/v1/me/top/tracks?time_range=long_term&limit=1&offset=0`, {
          headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${params.access_token}`
            },
          })
          .then(response => response.json())
          .then(data => this.setState({topTrack: data.items[0].album.images[0].url}));
    
  
      try {
        expiryTime = JSON.parse(localStorage.getItem('expiry_time'));
      } catch (error) {
        expiryTime = '0';
      }
        this.setState({ expiryTime });
      }
      setExpiryTime = (expiryTime) => {
      this.setState({ expiryTime });

      
    };
    
    isValidSession = () => {
      const currentTime = new Date().getTime();
      const expiryTime = this.state.expiryTime;
      const isSessionValid = currentTime < expiryTime;
      console.log(expiryTime)
      console.log(currentTime)
      return isSessionValid;
    };

    chooseGame = (type, length) => {
      this.setState({gameStart: length})
      this.setState({gameType: type})
    }

    resetGame = () => {
      this.setState({gameStart: 'none'})
    }

    render() {
      let {gameStart, topArtist, topTrack, gameType} = this.state
      const { classes = {} } = this.props

      return (
        <div className={classes.root}>
          {gameStart === 'none' ? 
            <div className={classes.container}>
              <div className={classes.section} 
                style={{backgroundImage: `linear-gradient(to top, #191414, rgba(255,0,0,0) 75%), url('${topArtist}')`, backgroundSize: 'cover'}}>
                <div className={classes.gameTitle}>Artists</div>
                <button className={classes.button} onClick={() => this.chooseGame('artist', 'short_term')}>Last Four Weeks</button>
                <button className={classes.button} onClick={() => this.chooseGame('artist', 'medium_term')}>Last Six Months</button>
                <button className={classes.button} onClick={() => this.chooseGame('artist', 'long_term')}>All Time</button>
              </div>
              <div className={classes.section} 
                style={{backgroundImage: `linear-gradient(to top, #191414, rgba(255,0,0,0) 75%), url('${topTrack}')`, backgroundSize: 'cover'}}>
                <div className={classes.gameTitle}>Songs</div>
                <button className={classes.button} onClick={() => this.chooseGame('songs', 'short_term')}>Last Four Weeks</button>
                <button className={classes.button} onClick={() => this.chooseGame('songs', 'medium_term')}>Last Six Months</button>
                <button className={classes.button} onClick={() => this.chooseGame('songs', 'long_term')}>All Time</button>
              </div>
            </div>
            
            :
            <div className={classes.artistgame}>
              {
                gameType === 'artist' ? 
                <ArtistGame gameType={gameStart} resetGame={this.resetGame}/> 
                :
                <SongGame gameType={gameStart} resetGame={this.resetGame}></SongGame>
              }
              
            </div>
          }
        </div>
      )
    }
}

Dashboard.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(Dashboard)
