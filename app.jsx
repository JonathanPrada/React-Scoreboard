var PLAYERS = [
  {
    name: "Jack",
    score: 31,
    id: 1,
  },
  {
    name: "Andy",
    score: 35,
    id: 2,
  },
  {
    name: "Adrian",
    score: 42,
    id: 3,
  },
];

var nextId = 4;
  
  
//create our Stopwatch component
//We will add this stop watch into the header
var Stopwatch = React.createClass ({
    //Implementing state in our component
    getInitialState: function() {
      //Returns an object
      //We will use elapsed time to add our time passed from stopwatch
      return {
         running: false,
         elapsedTime: 0,
         previousTime: 0,
      }
    },
  
    //Call this method as soon as stopwatch added on dom
    //Set interval will call our method every 180 milliseconds
    componentDidMount: function() {
       this.interval = setInterval(this.onTick, 180);
    },
    
    //Call this method just before stopwatch removed from DOM
    //Prevents memory leakage
    componentWillUnmount: function() {
       clearInterval(this.interval);
    },
  
    //On tick method
    onTick: function() {
      if (this.state.running) {
        var now = Date.now();
        this.setState({
        previousTime: now,
        elapsedTime: this.state.elapsedTime + (now - this.state.previousTime),
        });
    }
      console.log('onTick');
    },
  
    //Implementing the methods triggered by the onClicks in our render function
    onStart: function() {
      this.setState({running: true,
      previousTime: Date.now(),
    }); 
    },
  
    onStop: function() {
      this.setState({running: false});
    },
  
    onReset: function() {
      this.setState({
        elapsedTime: 0,
        previousTime: Date.now(),
    });
    },
  
    //Render strictly for printing out the virtual dom
    render: function () {
    //return html markup
    //Use ternary operator within a jsx expression to change markup
    //With ternary operator, if state running, if true stop, if false stop
    
    //Store the time passed
    var seconds = Math.floor(this.state.elapsedTime/1000);
  
  
    return (
        <div className="stopwatch">
        <h2>Stopwatch</h2>
        <div className="stopwatch-time">{ seconds }</div>
        { 
        this.state.running ? 
        <button onClick={this.onStop}>Stop</button> 
        :
        <button onClick={this.onStart}>Start</button>
        }
        <button onClick={this.onReset}>reset</button>
        </div>
     );
    }
  });
  
var AddPlayerForm = React.createClass({
    propTypes: {
      onAdd: React.PropTypes.func.isRequired,
    },
  
    getInitialState: function() {
      return {
        name: "",
      };
    },
  
    onNameChange: function(e) {
      this.setState({name: e.target.value});
    },
  
    onSubmit: function(e) {
      e.preventDefault();
      //Takes a name for the application to give to the new player    
      this.props.onAdd(this.state.name);
      //Update our state to clear out name
      this.setState({name: ""});
    },
  
    render: function() {
    return (
        <div className="add-player-form">
          <form onSubmit={this.onSubmit}>
            <input type="text" value={this.state.name} onChange={this.onNameChange}/>
            <input type="submit" value="Add player" />
          </form>
        </div>
      );
    }
  });
  
 
function Stats(props) {
  
  var totalPlayers = props.players.length;
  var totalPoints = props.players.reduce(function(total, player) {
    return total + player.score;
  }, 0);
  
   return (
    <table className="stats">
      <tbody>
        <tr>
          <td>Players</td>
          <td>{totalPlayers}</td>
        </tr>
        <tr>
          <td>Total points</td>
          <td>{totalPoints}</td>
        </tr>
      </tbody>
    </table>
  
  )
  }
  

Stats.PropTypes = {
    players: React.PropTypes.array.isRequired,
  };
  
  
function Header(props) {
  return (
    <div className="header">
      <Stats players={props.players}/>
      <h1>{props.title}</h1>
      <Stopwatch />
    </div>
  );
}

Header.propTypes = {
  title: React.PropTypes.string.isRequired,
  players: React.PropTypes.array.isRequired,
};


function Counter(props) {
      return (
      <div className="counter">
        <button className="counter-action decrement" onClick={function() {props.onChange(-1);}}> - </button>
        <div className="counter-score"> {props.score} </div>
        <button className="counter-action increment" onClick={function() {props.onChange(+1);}}> + </button>
      </div>
    );
  }
  
  
Counter.propTypes = {
    score: React.PropTypes.number.isRequired,
    onChange: React.PropTypes.func.isRequired,
  }
  
  
function Player(props) {
  return (
    <div className="player">
      <div className="player-name">
        <a className="remove-player" onClick={props.onRemove}>X</a>
        {props.name}
      </div>
      <div className="player-score">
        <Counter score={props.score} onChange={props.onScoreChange}/>
      </div>
    </div>
  );
}

Player.propTypes = {
  name: React.PropTypes.string.isRequired,
  score: React.PropTypes.number.isRequired,
  onScoreChange: React.PropTypes.func.isRequired,
  onRemove: React.PropTypes.func.isRequired,
};

var Application = React.createClass({
  
    propTypes : {
      title: React.PropTypes.string,
      initialPlayers: React.PropTypes.arrayOf(React.PropTypes.shape({
        name: React.PropTypes.string.isRequired,
        score: React.PropTypes.number.isRequired,
        id: React.PropTypes.number.isRequired,
      })).isRequired,
    },
  
    getDefaultProps: function () {
       return {
        title: "Scoreboard",
       }
    },
  
    getInitialState: function () {
      return {
        players: this.props.initialPlayers,
      };
    },
  
  onScoreChange: function (index, delta) {
    this.state.players[index].score += delta;
    this.setState(this.state);
  },
    
  onPlayerAdd: function(name) {
    //Push the current name state passed into our players object
    this.state.players.push({
      name: name,
      score: 0,
      id: nextId,
    });
    //Render our latest state
    this.setState(this.state);
    //Increment the nextId var value by 1
    nextId += 1;
  },
    
  onRemovePlayer: function(index) {
    //Get the players array and remove from 1 item from the index
    this.state.players.splice(index, 1);
    //Render our latest state
    this.setState(this.state);
  },
  
    render: function() {
        return (
        <div className="scoreboard">
          <Header title={this.props.title} players={this.state.players}/>
        
          <div className="players">
            {this.state.players.map(function(player, index) {
              return (
                <Player 
                onScoreChange={function (delta) {this.onScoreChange(index, delta)}.bind(this)}
                onRemove={function() {this.onRemovePlayer(index)}.bind(this)}
                name={player.name}
                score={player.score}
                key={player.id} />
               );
            }.bind(this))}
          </div>
          <AddPlayerForm onAdd={this.onPlayerAdd}/>                      
        </div>
  );
  }
  });

ReactDOM.render(<Application initialPlayers={PLAYERS}/>, document.getElementById('container'));
