import React from 'react';
import PropTypes from 'prop-types';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import useUserContext from '../../hooks/useUserContext';

const channelSchema = Yup.object({
  name: Yup.string()
    .min(1, 'Must be between 1 and 16 character!')
    .max(16, 'Must be between 1 and 16 character!')
    .matches(/^[a-zA-Z0-9_]+$/,
      'Channel name can only include alphanumeric characters and underscores!')
    .required('Required!'),
});

const Sidebar = ({
  currentChannel, changeChannel, joinChannel, createChannel,
}) => {
  const { user, logout } = useUserContext();

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <p className="sidebar__subtext">Logged in as:</p>
        <div className="sidebar__user">
          <h3 className="sidebar__username">{user.username}</h3>
          <button
            type="button"
            className="sidebar__logout"
            onClick={logout}
          >
            &#10006;
          </button>
        </div>
      </div>
      <section className="sidebar__channels">
        <h2>Channels</h2>
        {user.channels.map((channel) => (
          <button
            type="button"
            className={`channel ${channel.id === currentChannel.id ? 'current' : ''}`}
            onClick={() => changeChannel(channel.id)}
            key={channel.id}
          >
            {channel.name}
          </button>
        ))}
      </section>
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
                Join
              </button>
              <ErrorMessage name="name" component="p" />
            </Form>
          )}
        </Formik>
      </section>
    </div>
  );
};

Sidebar.propTypes = {
  currentChannel: PropTypes.oneOfType([
    PropTypes.exact({
      id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      messages: PropTypes.arrayOf(PropTypes.object).isRequired,
      users: PropTypes.arrayOf(PropTypes.object).isRequired,
      createdAt: PropTypes.string.isRequired,
    }).isRequired,
    PropTypes.exact({}),
  ]).isRequired,
  changeChannel: PropTypes.func.isRequired,
  joinChannel: PropTypes.func.isRequired,
  createChannel: PropTypes.func.isRequired,
};

export default Sidebar;
