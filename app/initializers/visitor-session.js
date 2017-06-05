export function initialize( application ) {
  [
    'component',
    'controller',
    'route'
  ].forEach((entity) => {
    application.inject(entity, 'visitorSession', 'service:visitor-session')
  });
}

export default {
  name: 'visitor-session',
  initialize
};
