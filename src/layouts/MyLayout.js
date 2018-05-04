import React from 'react';
import { Layout, Button } from 'antd';
import { Route, Switch, routerRedux } from 'dva/router';
import { connect } from 'dva';

class MyLayout extends React.PureComponent {
  ok() {
    const { dispatch } = this.props;
    dispatch(routerRedux.push('/myLayout/myContent'));
  }

  render() {
    const { routerData } = this.props;
    const myContent = routerData['/myLayout/myContent'].component;
    return (
      <Layout>
        <div>
          <Button onClick={this.ok.bind(this)}>ok</Button>
        </div>

        <div>
          <Switch>
            <Route path="/myLayout/myContent" component={myContent} />
            <Route render={() => <div>404</div>} />
          </Switch>
        </div>
      </Layout>
    );
  }
}

export default connect()(MyLayout);
