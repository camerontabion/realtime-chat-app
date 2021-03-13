import React from 'react';
import PropTypes from 'prop-types';
import { Link, useHistory } from 'react-router-dom';
import {
  Formik,
  Form,
  Field,
} from 'formik';
import * as Yup from 'yup';

const RegisterSchema = Yup.object({
  username: Yup.string()
    .min(2, 'Must be between 2 and 30 characters!')
    .max(30, 'Must be between 2 and 30 characters!')
    .matches(/^[a-zA-Z0-9_]+$/, 'Can only include alphanumeric characters and underscores!')
    .required('Required!'),
  password: Yup.string()
    .min(6, 'Must be at least 6 characters!')
    .required('Required!'),
});

const initialValues = {
  username: '',
  password: '',
};

const RegisterForm = ({ register }) => {
  const history = useHistory();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={RegisterSchema}
      onSubmit={async (values, { setSubmitting, setFieldError }) => {
        try {
          await register(values);
        } catch (err) {
          if (err.message.toLowerCase().includes('username')) {
            setFieldError('username', err.message);
          }
        } finally {
          setSubmitting(false);
          history.push('/app');
        }
      }}
    >
      {({ isSubmitting, errors, touched }) => (
        <Form className="form">
          <h1 className="form__header">Register</h1>
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
            <p className="form__muted">
              Username must be between 2 and 30 characters and can only
              contain alphanumeric characters and underscores.
            </p>
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
            <p className="form__muted">
              Password must be at least 6 characters.
            </p>
          </div>
          <button type="submit" disabled={isSubmitting} className="form__submit">
            {!isSubmitting ? 'Register' : 'Registering...'}
          </button>
          <div className="form__group form__link">
            Already have an account?
            <Link to="/login">Login</Link>
          </div>
        </Form>
      )}
    </Formik>
  );
};

RegisterForm.propTypes = {
  register: PropTypes.func.isRequired,
};

export default RegisterForm;
