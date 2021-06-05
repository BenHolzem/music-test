import React from 'react'
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types'

const {
    REACT_APP_CLIENT_ID,
    REACT_APP_AUTHORIZE_URL,
    REACT_APP_REDIRECT_URL
  } = process.env;
  
const handleLogin = () => {
    window.location = `https://accounts.spotify.com/authorize?client_id=${REACT_APP_CLIENT_ID}&redirect_uri=${REACT_APP_REDIRECT_URL}&response_type=token&show_dialog=true&scope=user-top-read`;
  };

const styles = () => ({
    root: {
        height: 'inherit'
    },
    title: {
        height: 'inherit',
        flexDirection: 'column',
        justifyContent: 'center',
        display: 'flex',
        marginLeft: '50px',
        marginRight: '50px',
        marginBottom: '25px',
        color: '#8996A9',
        fontFamily: 'GothamMedium',
        fontSize: '35px'
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
        "&:hover": {
            backgroundColor: '#f46771'
        },
        "&:focus": {
            backgroundColor: '#bf2e38'
        }
    },
    text: {
        marginBottom: '25px'
    }
})

class Home extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
        }
    }
    
    render() {
        const { classes = {} } = this.props
        return (
            <div className={classes.root}>
                <div className={classes.title}>
                    <div className={classes.text}>How well do you know your music taste?</div>
                    <div><button onClick={handleLogin} className={classes.button}>Play</button></div>
                </div>
                
            </div>
        )
    }
}

Home.propTypes = {
    classes: PropTypes.object.isRequired
}
export default withStyles(styles)(Home)
