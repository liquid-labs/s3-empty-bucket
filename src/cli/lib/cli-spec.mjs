export const cliSpec = {
  mainCommand : 's3-empty-bucket',
  mainOptions : [
    { name : 'bucketName', required : true, defaultOption : true, description : 'The name of the bucket to empty.' },
    { name : 'delete', description : 'Deletes the bucket after emptying it.', type : Boolean },
    {
      name        : 'document',
      type        : Boolean,
      description : 'Generates command line documentation in Markdown format. All other options are ignored.'
    },
    { name : 'help', type : Boolean, alias : '?', description : 'Prints command help.' },
    { name : 'profile', alias : 'p', description : 'The SSO profile to use.' },
    { name : 'quiet', alias : 'q', type : Boolean, description : 'Suppresses output.' },
    {
      name        : 'throw-error',
      type        : Boolean,
      description : 'Instead of printing simple message, allows exceptions to bubble up to the user.'
    }
  ]
}
