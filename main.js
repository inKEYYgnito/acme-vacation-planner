/* eslint-disable react/no-multi-comp */
/* eslint-disable react/react-in-jsx-scope */
const { Component } = React
const { render } = ReactDOM

class VacationForm extends Component {
    state = { 
        start: '',
        end: '',
    }
    handleChange = (ev, prop) => {
        this.setState({ [prop]: moment(ev.target.value).format('L') })
    }
    handleClick = () => {
        const { start, end } = this.state
        this.props.onCreate(start, end)
    }
    render() {
        const { start, end } = this.state
        return (
            <div id="vacation-form">
                <input type="date" id="start" name="trip-start" value={ start? moment(start).format('YYYY-MM-DD') : '' } onChange={ ev => this.handleChange(ev, 'start') }/>
                <input type="date" id="end" name="trip-end" value={ start? moment(end).format('YYYY-MM-DD') : '' } onChange={ ev => this.handleChange(ev, 'end') }/>
                <button onClick={ this.handleClick }>Create Vacation</button>
                <span>{ this.props.error }</span>
            </div>
        )
    }
}

const VacationLists = ({ vacations, onDelete }) => {
    return (
        <React.Fragment>
            {
                vacations ? vacations.map(v => (
                    <div key={ v.id} >
                        <p>{ moment(v.startDate).format('dddd MM/DD/YY') }</p>
                        <p>to</p>
                        <p>{ moment(v.endDate).format('dddd MM/DD/YY') }</p>
                        <p>{ moment(v.endDate).format('DDD') - moment(v.startDate).format('DDD') } days</p>
                        <button onClick={ () => onDelete(v.id) }>Remove</button>
                    </div>
                )) : null
            }
        </React.Fragment>
    )
}

class App extends Component {
    state = {
        user: null,
        vacations: null,
        error: ''
    }
    async componentDidMount() {
        const user = await fetchUser()
        const vacations = await getVacations(user.id)
        this.setState({ user, vacations })
    }
    handleCreate = async (startDate, endDate) => {
        try {
            const { user, vacations } = this.state
            const vacation = await createVacation(user.id, { startDate, endDate })
            this.setState({ vacations: [...vacations, vacation] })
        } catch (error) {
            this.setState({ error: error.message })
        }
    }
    handleDelete = (vacationId) => {
        const { user, vacations } = this.state
        deleteVacation(user.id, vacationId)
        this.setState({ vacations: vacations.filter(v => v.id !== vacationId) })
    }
    render() {
        const { user, vacations, error } = this.state
        return user ? (
            <React.Fragment>
                <h1>Acme Vacation Planner for {user.fullName}</h1>
                <VacationForm error={ error } onCreate={ this.handleCreate }></VacationForm>
                <VacationLists vacations={ vacations } onDelete={ this.handleDelete }></VacationLists>
            </React.Fragment>
        ) : <h3>There's no user at this time. Try again later.</h3>
    }
}

const root = document.getElementById("root")
render(<App />, root)