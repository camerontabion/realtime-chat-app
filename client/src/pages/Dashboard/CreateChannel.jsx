import React from 'react';
import PropTypes from 'prop-types';
import {
  Formik,
  Form,
  Field,
  ErrorMessage,
} from 'formik';
import * as Yup from 'yup';

const channelSchema = Yup.object({
  name: Yup.string()
    .min(1, 'Must be between 1 and 16 character!')
    .max(16, 'Must be between 1 and 16 character!')
    .matches(/^[a-zA-Z0-9_]+$/,
      'Channel name can only include alphanumeric characters and underscores!')
    .required('Required!'),
});

const CreateChannel = ({ createChannel }) => (
  <section className="sidebar__create-channel">
    <Formik
      initialValues={{ name: '' }}
      validationSchema={channelSchema}
      onSubmit={async (values, { setSubmitting, setFieldError, resetForm }) => {
        try {
          await createChannel(values.name);
          resetForm();
        } catch (err) {
          setFieldError('name', err.message);
        } finally {
          setSubmitting(false);
        }
      }}
      validateOnBlur={false}
      validateOnChange={false}
    >
      {() => (
        <Form>
          <h4>Create a channel:</h4>
          <Field type="text" name="name" />
          <button type="submit">
            Create
          </button>
          <ErrorMessage name="name" component="p" />
        </Form>
      )}
    </Formik>
  </section>
);

CreateChannel.propTypes = {
  createChannel: PropTypes.func.isRequired,
};

export default CreateChannel;
