import { DisplayError, PageWrapper } from '../components';
const Error = () => {
  return (
    <PageWrapper>
      <DisplayError message={'NOT FOUND'} status={'404'} />
    </PageWrapper>
  );
};

export default Error;
