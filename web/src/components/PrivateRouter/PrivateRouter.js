import React from 'react';
import { Route, Redirect} from 'react-router-dom';
import PropTypes from 'prop-types';

const PrivateRouter = props => {
  const operationNames = JSON.parse(localStorage.getItem('operationNames'));
  const { layout: Layout, component: Component, ...rest } = props;
  if (!operationNames) {
    return (<Redirect to="/sign-in" />);
  } else {
    if (operationNames.includes(props.operationName) || props.isDashboard === 'true') {
      return (
          <Route
            {...rest}
            render={matchProps => (
              <Layout>
                <Component {...matchProps} />
              </Layout>
            )}
          />
        );
    } else {
      return (<Redirect to="/not-found" />);
    }
  }
  // if (operationNames && (operationNames.includes(props.operationName) || props.isDashboard === 'true')) {
  //   return (
  //       <Route
  //         {...rest}
  //         render={matchProps => (
  //           <Layout>
  //             <Component {...matchProps} />
  //           </Layout>
  //         )}
  //       />
  //     );
  // } else {
  //   return (<Redirect to="/not-found" />);
  // }
};

PrivateRouter.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string,
  isDashboard: PropTypes.string,
  operationName: PropTypes.string
};

export default PrivateRouter;
