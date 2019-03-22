/**
 *    SPDX-License-Identifier: Apache-2.0
 */

import React, { Component } from 'react';

import compose from 'recompose/compose';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import TextField from '@material-ui/core/TextField';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';

import { shape, string } from 'prop-types';

import { authSelectors, authOperations } from '../../state/redux/auth';
import Grid from '@material-ui/core/Grid';

const styles = theme => ({
  container: {
    width: 'auto',
    display: 'block', // Fix IE 11 issue.
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
      width: 400,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme
      .spacing.unit * 3}px`
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing.unit
  },
  title: {
    marginTop: theme.spacing.unit * 2
  },
  actions: {
    marginTop: theme.spacing.unit * 3
  }
});

export class Enroll extends Component {
  static propTypes = {
    classes: shape({
      form: string,
      container: string,
      paper: string,
      actions: string
    }).isRequired
  };

  constructor(props) {
    super(props);
    const { enrolled } = props;
    this.state = {
      user: {
        error: null,
        value: ''
      },
      password: {
        error: null,
        value: ''
      },
      affiliation: {
        error: null,
        value: ''
      },
      roles: {
        error: null,
        value: ''
      },
      rolesList: ['admin', 'reader', 'user'],
      error: '',
      enrolled,
      isLoading: false
    };
  }

  componentWillReceiveProps(nextProps) {
    const { enrolled = [], error } = nextProps;
    this.setState(() => ({
      enrolled,
      error
    }));
  }

  handleChange = event => {
    const { target } = event;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const { name } = target;
    this.setState({
      [name]: { value }
    });
  };

  submitForm = async e => {
    e.preventDefault();

    const { enroll, onEnroll } = this.props;
    const { user, password, affiliation, roles } = this.state;

    const userInfo = {
      user: user.value,
      password: password.value,
      affiliation: affiliation.value,
      roles: roles.value
    };

    await enroll(userInfo);

    onEnroll(userInfo);

    return true;
  };

  render() {
    const {
      user,
      password,
      affiliation,
      roles,
      rolesList,
      isLoading
    } = this.state;
    const { classes, error, onClose } = this.props;
    return (
      <div className={classes.container}>
        <Paper className={classes.paper}>
          <Typography
            className={classes.title}
            component="h5"
            variant="headline"
          >
            Enroll User
          </Typography>
          <form className={classes.form} onSubmit={this.submitForm}>
            <FormControl margin="normal" required fullWidth>
              <TextField
                required
                fullWidth
                id="user"
                name="user"
                label="User"
                disabled={isLoading}
                value={user.value}
                onChange={e => this.handleChange(e)}
                margin="normal"
              />
              {user.error && (
                <FormHelperText id="component-error-text" error>
                  {user.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextField
                required
                fullWidth
                error={!!password.error}
                id="password"
                type="password"
                name="password"
                label="Password"
                disabled={isLoading}
                value={password.value}
                onChange={e => this.handleChange(e)}
                margin="normal"
              />
              {password.error && (
                <FormHelperText id="component-error-text" error>
                  {password.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextField
                error={!!affiliation.error}
                required
                fullWidth
                id="affiliation"
                name="affiliation"
                label="Affiliation"
                disabled={isLoading}
                value={affiliation.value}
                onChange={e => this.handleChange(e)}
                margin="normal"
              />
              {affiliation.error && (
                <FormHelperText id="component-error-text" error>
                  {affiliation.error}
                </FormHelperText>
              )}
            </FormControl>
            <FormControl margin="normal" required fullWidth>
              <TextField
                required
                fullWidth
                select
                error={!!roles.error}
                id="roles"
                type="roles"
                name="roles"
                label="Roles"
                disabled={isLoading}
                value={roles.value}
                onChange={e => this.handleChange(e)}
                margin="normal"
              >
                {rolesList.map(item => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TextField>
              {roles.error && (
                <FormHelperText id="component-error-text" error>
                  {roles.error}
                </FormHelperText>
              )}
            </FormControl>
            {error && (
              <FormHelperText id="component-error-text" error>
                {error}
              </FormHelperText>
            )}
            <Grid
              container
              spacing={16}
              direction="row"
              justify="flex-end"
              className={classes.actions}
            >
              <Grid item>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  onClick={onClose}
                >
                  Cancel
                </Button>
              </Grid>
              <Grid item>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                >
                  Enroll
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </div>
    );
  }
}

const { errorSelector, enrolledSelector } = authSelectors;

export default compose(
  withStyles(styles),
  connect(
    state => ({
      enrolled: enrolledSelector(state),
      error: errorSelector(state)
    }),
    {
      enroll: authOperations.enroll
    }
  )
)(Enroll);