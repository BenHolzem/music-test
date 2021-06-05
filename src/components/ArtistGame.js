import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'
import transitions from '@material-ui/core/styles/transitions';

let choices = ''
let battleNo = 0
let tiedDataList = []
let recordDataList = []
let pointer = 0
let leftIndex = 0
let rightIndex = 0
let rightInnerIndex = 0
let leftInnerIndex = 0
let sortedIndexList = []
let parentIndexList = []
let sortedNo = 0
let totalBattles = 0
let dataToSort = []
let leftArtistIndex
let rightArtistIndex
let finalArtists = []
let percent = 0

const styles = () => ({
  root: {
    height: 'inherit',
    color: '#8996A9'
  },
  title: {
    color: '#8996A9',
    fontFamily: 'GothamMedium',
    fontSize: '40px',
    marginBottom: '50px',
    marginLeft: '20px',
    marginRight: '20px',
    '@media only screen and (max-width:960px)': {
      marginBottom: '20px',
      fontSize: '35px'
    }
  },
  image: {
    borderRadius: '50%',
    height: '300px',
    width: '300px',
    position: 'relative',
    transition: '.2s',
    marginLeft: '50px',
    marginRight: '50px',
    '&:hover' : {
      boxShadow: 'inset 0 0 0 1000px rgba(256,256,256,.1)'
    },
    '@media only screen and (max-width:960px)': {
      height: '200px',
      width: '200px',
      marginLeft: '0px',
      marginRight: '0px',
    }
  },
  section: {
    margin: '0px',    
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
  },
  container: {
    display: 'flex',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    '@media only screen and (max-width:960px)': {
      flexDirection: 'column',
    }
  },
  main: {
    height: 'inherit',
    flexDirection: 'column',
    justifyContent: 'center',
    display: 'flex',
  },
  name: {
    marginTop:'15px',
    marginBottom: '15px',
    fontFamily: 'GothamMedium',
    fontSize: '25px'
  },
  artistContainer: {
    width: '400px',
    height: '70px',
    backgroundColor: 'white', 
    margin: '5px',
    borderRadius: '5px',
    display: 'flex', 
    alignItems: 'center',
    fontSize: '20px',
    fontFamily: 'GothamMedium',
    textAlign: 'left',
    '@media only screen and (max-width:960px)': {
      width: '175px',
      height: '50px', 
      fontSize: '12px'   
    },
  },
  listContainer: {

  },
  resultContainer: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    '@media only screen and (max-width:960px)': {
      flexDirection: 'row',
      alignItems: 'center'
    }
  },
  artistImage: {
    height: '55px',
    width: '55px',
    borderRadius: '50px',
    margin: '10px',
    '@media only screen and (max-width:960px)': {
      width: '35px',
      height: '35px',    
    },
    
  },
  resultTitle: {
    marginTop: '25px',
    marginBottom: '15px',
    color: '#8996A9',
    fontFamily: 'GothamMedium', 
    fontSize: '20px'
  },
  button: {
    backgroundColor: '#f03a47',
    border: 'none',
    height: '50px',
    width: '150px',
    borderRadius: '500px',
    fontFamily: 'GothamMedium',
    fontSize: '20px',
    color: '#e8ebed',
    transition: '.3s',
    marginTop: '15px',
    marginBottom: '25px',
    "&:hover": {
        backgroundColor: '#f46771'
    },
    "&:focus": {
        backgroundColor: '#bf2e38'
    }
  },
  progressContainer: {
    display: 'flex',
    justifyContent: 'center',
    width: '100%',
    marginTop: '30px',
    '@media only screen and (max-width:960px)': {
      marginTop: '15px',
    }
  },
  progressBar: {
    width: '400px',
    height: '40px',
    backgroundColor: 'white',
    borderRadius: '5px',
    display: 'flex',
    alignItems: 'center',
    '@media only screen and (max-width:960px)': {
      width: '350px',
    }
  },
  bar: {
    height: '35px',
    backgroundColor: '#20cbb8',
    borderRadius: '5px',
    marginLeft: '3px'
  }, 
  progressText: {
    position: 'absolute',
    marginLeft: '150px',
    color: '#8996A9',
    fontFamily: 'GothamMedium',
    '@media only screen and (max-width:960px)': {
      marginLeft: '125px',
    }
  }
})

class ArtistGame extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      artistList: [],
      index: 0,
      score: 0,
      play: 'before',
      leftArtist: {
        name: '',
        images: []
      },
      rightArtist: {
        name: '',
        images: []
      }
    }
  }

  componentDidMount() {
    const params = JSON.parse(localStorage.getItem('params'))
    const {gameType} = this.props
    fetch(`https://api.spotify.com/v1/me/top/artists?time_range=${gameType}&limit=50&offset=0`, {
      headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${params.access_token}`
        },
    })
    .then(response => response.json())
    .then(data => {
      let array = data.items.map(({name, images}) => ({name, images}));

      this.setState({artistList: array})
      dataToSort = array
    });

    setTimeout(function() { this.start() }.bind(this), 300)

  }

  start = () => {
    finalArtists = []
    percent = 0
    dataToSort = dataToSort
      .map(a => [Math.random(), a])
      .sort((a,b) => a[0] - b[0])
      .map(a => a[1]);


    recordDataList = dataToSort.map(() => 0);
    tiedDataList = dataToSort.map(() => -1)
  
    sortedIndexList[0] = dataToSort.map((val, idx) => idx)
    parentIndexList[0] = -1
  
    let midpoint = 0
    let marker = 1
  
    for (let i = 0; i < sortedIndexList.length; i++) {
      if (sortedIndexList[i].length > 1) {
        let parent = sortedIndexList[i]
        midpoint = Math.ceil(parent.length / 2)
  
        sortedIndexList[marker] = parent.slice(0, midpoint)
        totalBattles += sortedIndexList[marker].length
        parentIndexList[marker] = i
        marker++
  
        sortedIndexList[marker] = parent.slice(midpoint, parent.length)
        totalBattles += sortedIndexList[marker].length
        parentIndexList[marker] = i
        marker++
      }
    }
  
    leftIndex = sortedIndexList.length - 2
    rightIndex = sortedIndexList.length - 1
  
    leftInnerIndex = 0
    rightInnerIndex = 0

    leftArtistIndex = sortedIndexList[leftIndex][leftInnerIndex];
    rightArtistIndex = sortedIndexList[rightIndex][rightInnerIndex];
    this.setState({leftArtist: dataToSort[leftArtistIndex]});
    this.setState({rightArtist: dataToSort[rightArtistIndex]});
    this.setState({play: 'play'})
  }


  pick = (choice) => {
    switch (choice) {
      case 'left': {
        if (choices.length === battleNo - 1) {
          this.setState({choices: choices += '0'})
        }
        this.recordData('left')
        while(tiedDataList[recordDataList[pointer - 1]] !== -1) {
          this.recordData('left')
        }
        break
      } 
      case 'right': {
        if (choices.length === battleNo - 1) {
          choices += '1'
        }
        this.recordData('right')
        while (tiedDataList[recordDataList[pointer - 1]] !== -1) {
          this.recordData('right')
        }
        break
      }
      default: {
        break
      }
    }

    const leftListLen = sortedIndexList[leftIndex].length
    const rightListLen = sortedIndexList[rightIndex].length

    if (leftInnerIndex < leftListLen && rightInnerIndex === rightListLen) {
      while (leftInnerIndex < leftListLen) {
        this.recordData('left')
      }
    } else if (leftInnerIndex === leftListLen && rightInnerIndex < rightListLen) {
      while (rightInnerIndex < rightListLen) {
        this.recordData('right')
      }
    }

    if (leftInnerIndex === leftListLen && rightInnerIndex === rightListLen) {
      for (let i = 0; i < leftListLen + rightListLen; i++) {
        sortedIndexList[parentIndexList[leftIndex]][i] = recordDataList[i]
      }
      sortedIndexList.pop()
      sortedIndexList.pop()
      leftIndex = leftIndex - 2
      rightIndex = rightIndex - 2
      leftInnerIndex = 0
      rightInnerIndex = 0
  
      sortedIndexList.forEach((val, idx) => recordDataList[idx] = 0)
      pointer = 0;
    }

    if (leftIndex < 0) {
      percent = 100
      this.result()
    } else {
      leftArtistIndex = sortedIndexList[leftIndex][leftInnerIndex]
      rightArtistIndex = sortedIndexList[rightIndex][rightInnerIndex]
      this.setState({leftArtist: dataToSort[leftArtistIndex]})
      this.setState({rightArtist: dataToSort[rightArtistIndex]})
      percent = Math.floor(sortedNo * 100 / totalBattles)
      battleNo++
    }
  }

  recordData = (chioce) => {
    if (chioce === 'left') {
      recordDataList[pointer] = sortedIndexList[leftIndex][leftInnerIndex]
      leftInnerIndex++
    } else {
      recordDataList[pointer] = sortedIndexList[rightIndex][rightInnerIndex]
      rightInnerIndex++
    }
    
    pointer++
    sortedNo++
  }
  
  result = () => {
    let rankNum = 1;
    let tiedRankNum = 1;

    const finalSortedIndexes = sortedIndexList[0].slice(0);

    dataToSort.forEach((val, idx) => {
      const artistIndex = finalSortedIndexes[idx];
      const artist = dataToSort[artistIndex];

      finalArtists.push({ rank: rankNum, name: artist.name, img: artist.images });

      if (idx < dataToSort.length - 1) {
        if (tiedDataList[artistIndex] === finalSortedIndexes[idx + 1]) {
          tiedRankNum++
        } else {
          rankNum += tiedRankNum
          tiedRankNum = 1
        }
      }
    })

    this.setState({play: 'done'})
  }
  

  render() {
    const { leftArtist, rightArtist, play, artistList } = this.state
    const { classes = {} } = this.props
    return (
      <div className={classes.root}>
        { 
          play === 'before' &&
          <div/>
        }
        {
          play === 'play' &&
          <div className={classes.main}>
            <div className={classes.title}>Who do you listen to more?</div>
            <div className={classes.container}>
              <div className={classes.section}>
                <div className={classes.image} 
                  style={leftArtist.images.length != 0 ? {backgroundImage: `url('${leftArtist.images[0].url}')`, backgroundSize: 'cover'} : {backgroundColor: '#8996A9'}}
                  onClick={() => this.pick('left')}>
                </div>
                <div className={classes.name}>{leftArtist.name}</div>
              </div>
              <div className={classes.section}>
                <div className={classes.image} 
                  style={rightArtist.images.length != 0 ? {backgroundImage: `url('${rightArtist.images[0].url}')`, backgroundSize: 'cover'} : {backgroundColor: '#8996A9'}}
                  onClick={() => this.pick('right')}>
                </div>
                <div className={classes.name}>{rightArtist.name}</div>
              </div>
            </div>
            <div className={classes.progressContainer}>
              <div className={classes.progressBar}>
                <div className={classes.bar} style={{width: `${percent}%`}}></div>
                <div className={classes.progressText}>Progress: {percent}%</div>
              </div>
            </div>
          </div>
        }
        {
          play === 'done'  &&
          <div>
          <div className={classes.resultContainer}>
            <div className={classes.listContainer}>
              <div className={classes.resultTitle}>Your Ranking</div>
              {finalArtists.map((obj, index) => (
                <div className={classes.artistContainer}> 
                  <div className={classes.artistImage} 
                  style={obj.img.length != 0 ? {backgroundImage: `url('${obj.img[0].url}')`, backgroundSize: 'cover'} : {backgroundColor: '#8996A9'}}>
                  </div>
                  {obj.name}
                </div>
              ))
            }</div>
            <div className={classes.listContainer}>
              <div className={classes.resultTitle}>Actual Ranking</div>
              {artistList.map((obj, index) => (
                <div className={classes.artistContainer}> 
                  <div className={classes.artistImage} 
                  style={obj.images.length != 0 ? {backgroundImage: `url('${obj.images[0].url}')`, backgroundSize: 'cover'} : {backgroundColor: '#8996A9'}}>
                  </div>
                  {obj.name}
                </div>
              ))
            }</div>
          </div>
          <button className={classes.button} onClick={this.props.resetGame}>Home</button>
          </div>
        }
      </div>
    )
  }
}

ArtistGame.propTypes = {
  classes: PropTypes.object.isRequired
}
export default withStyles(styles)(ArtistGame)