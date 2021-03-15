import React from 'react';
import PropTypes from 'prop-types';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from 'formik';
import * as Yup from 'yup';

const JoinChannel = ({ joinChannel }) => (
  <section className="sidebar__join-channel">
    <Formik
      initialValues={{ id: '' }}
      validationSchema={Yup.object({ id: Yup.string().required('Enter an id!') })}
      onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
        try {
          await joinChannel(values.id);
          resetForm();
        } catch (err) {
          setFieldError('id', err.message);
        } finally {
          setSubmitting(false);
        }
      }}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {() => (
        <Form>
          <h4>Join channel by id:</h4>
          <Field type="text" name="id" />
          <button type="submit">
            Join
          </button>
          <ErrorMessage name="id" component="p" />
        </Form>
      )}
    </Formik>
  </section>
);

JoinChannel.propTypes = {
  joinChannel: PropTypes.func.isRequired,
};

export default JoinChannel;
