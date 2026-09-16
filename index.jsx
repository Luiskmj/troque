import { mdiArrowLeft, mdiArrowRight } from '@mdi/js';
import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Row,
} from 'reactstrap';
import Header from '../Header';
import Loading from '../Loading';
import ButtonV2 from '../_v2/Button';
import './styles.scss';

export default function Page({
  children,
  title,
  fullLoading,
  loading,
  back,
  next,
  topButtonLink,
  topButtonEva,
  border = '',
  withLogo,
}) {
  const history = useHistory();

  const childrenHeader = children && children.length > 1 ? children[0] : '';
  const childrenBody = children && children.length > 1 ? children[1] : children;

  if (fullLoading) {
    return <Loading shouldDarkenBg={false} />;
  }

  return (
    <>
      <Header withLogo={withLogo} />

      {loading && <Loading />}

      <Container className="mt--6 page-container" fluid>
        <Row>
          <Col className="mb-5 _px-0 md:_px-16" xl="12">
            <Card className="bg-gradient-secondary shadow _rounded-lg">
              {(title || back || next || topButtonLink || topButtonEva) && (
                <CardHeader className="bg-transparent">
                  <div className="d-flex flex-wrap">
                    <Col
                      xs="12"
                      md={topButtonLink || topButtonEva ? '6' : '12'}
                      className="d-flex align-items-center justify-content-between"
                    >
                      {title && !back && (
                        <Row>
                          <h6 className="_m-0 _text-black _text-center _typography-headline-sm">
                            {title}
                          </h6>
                        </Row>
                      )}
                      {back && (
                        <Row>
                          <div className="_py-4">
                            <ButtonV2
                              onClick={history.goBack}
                              icons={{
                                start: mdiArrowLeft,
                              }}
                              offset={['left', 'top', 'bottom']}
                            >
                              Voltar
                            </ButtonV2>
                          </div>
                        </Row>
                      )}
                      {next && (
                        <Row>
                          <div className="_py-4">
                            <ButtonV2
                              icons={{
                                end: mdiArrowRight,
                              }}
                              offset={['right', 'top', 'bottom']}
                              {...next}
                            >
                              Avançar
                            </ButtonV2>
                          </div>
                        </Row>
                      )}
                    </Col>

                    {(topButtonLink || topButtonEva) && (
                      <Col
                        xs="12"
                        md="6"
                        className="d-flex align-items-center justify-content-end"
                      >
                        {topButtonLink && (
                          <Button
                            color="link"
                            className="text-eva"
                            onClick={() =>
                              history.push(`/admin/painel-de-vendas`)
                            }
                          >
                            Botão em link
                          </Button>
                        )}
                        {topButtonEva && (
                          <Button
                            className="button-eva"
                            onClick={() => history.push(`/admin/home`)}
                          >
                            Botão EVA
                          </Button>
                        )}
                      </Col>
                    )}
                  </div>

                  {childrenHeader}
                </CardHeader>
              )}

              <CardBody className={`${border}`}>{childrenBody}</CardBody>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}
