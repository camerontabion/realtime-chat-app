import React from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import {
  Formik,
  Form,
  Field,
} from 'formik';
import * as Yup from 'yup';

const LoginSchema = Yup.object({
  username: Yup.string().required('Required!'),
  password: Yup.string().required('Required!'),
});

const initialValues = {
  username: '',
  password: '',
};

const LoginForm = ({ login }) => {
  const history = useHistory();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={LoginSchema}
      onSubmit={async (values, { setSubmitting, setErrors }) => {
        try {
          await login(values);
        } catch (err) {
          setErrors({
            username: 'Invalid username or password!',
            password: 'Invalid username or password!',
          });
        } finally {
          setSubmitting(false);
          history.push('/app');
        }
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className="form">
          <h1 className="form__header">Login</h1>
          <div className="form__group">
            <h3 className={`form__label ${touched.username && errors.username ? 'form__error' : ''}`}>
              Username
              {touched.username && errors.username ? (
                <em>{` - ${errors.username}`}</em>
              ) : (
                null
              )}
            </h3>
            <Field type="text" name="username" className="form__input" autoFocus />
          </div>
          <div className="form__group">
            <h3 className={`form__label ${touched.password && errors.password ? 'form__error' : ''}`}>
              Password
              {touched.password && errors.password ? (
                <em>{` - ${errors.password}`}</em>
              ) : (
                null
              )}
            </h3>
            <Field type="password" name="password" className="form__input" />
          </div>
          <button type="submit" disabled={isSubmitting} className="form__submit">
            {!isSubmitting ? 'Login' : 'Logging in...'}
          </button>
          <div className="form__group form__link">
            Don&apos;t have an account?
            <Link to="/register">Register</Link>
          </div>
        </Form>
      )}
    </Formik>
  );
};

LoginForm.propTypes = {
  login: PropTypes.func.isRequired,
};

export default LoginForm;
