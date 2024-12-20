function autoArchive() {
  console.log('Started autoArchive run.');
  var delayDays = 180;
  var pageSize = 500;
  var maxDate = new Date();
  maxDate.setDate(maxDate.getDate() - delayDays);

  var pageCount = 0;
  var isLastPage = false;
  var totalThreadsProcessed = 0;
  var totalThreadsArchived = 0;

  do {
    var pageThreads = GmailApp.getInboxThreads(pageCount * pageSize, pageSize);
    pageCount++;
    isLastPage = pageThreads.length < pageSize;

    if (pageThreads.length > 0) {
      totalThreadsProcessed += pageThreads.length;
      console.log('Page ' + pageCount + ': found ' + pageThreads.length + ' inbox threads');

      if (pageThreads[pageThreads.length - 1].getLastMessageDate() >= maxDate) {
        console.log('Skipping page ' + pageCount + ': all threads after threshold');
        continue;
      }

      var pageThreadsArchived = 0;

      try {
        for (var i = 0; i < pageThreads.length; i++) {
          if (pageThreads[i].getLastMessageDate() < maxDate) {
            pageThreads[i].markRead();
            pageThreads[i].moveToArchive();
            pageThreadsArchived++;
          }
        }
        console.log('Successfully archived ' + pageThreadsArchived + ' threads.');
        totalThreadsArchived += pageThreadsArchived;
      }
      catch (e) {
        console.error('Could Not Start Run: ' + e);
      }
    }
    else {
      console.log('Found ' + pageThreads.length + ' threads in inbox. Exiting.');
    }
  } while (!isLastPage);

  console.log('Total threads processed: ' + totalThreadsProcessed);
  console.log('Total threads archived: ' + totalThreadsArchived);
}
