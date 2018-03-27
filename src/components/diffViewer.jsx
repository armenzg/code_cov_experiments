import { Link } from 'react-router-dom';
import hash from '../utils/hash';
import settings from '../settings';
import { githubUrl, codecovUrl, ccovBackendUrl } from '../utils/coverage';
import { hgDiffUrl, pushlogUrl } from '../utils/hg';

const DiffViewer = ({
  appError, coverage, parsedDiff, repoName,
}) => (
  <div className="codecoverage-diffviewer">
    <div className="return-home">
      <Link to="/" href="/">Return to main page</Link>
    </div>
    <span className="error_message">{appError}</span>
    {(coverage && coverage.summary !== settings.STRINGS.PENDING) && (
      <div>
        <CoverageMeta
          node={coverage.node}
          overallCoverage={coverage.overall_cur}
          repoName={repoName}
          summary={coverage.summary}
        />
        {parsedDiff.map((diffBlock) => {
          // We only push down the subset of code coverage data
          // applicable to a file
          const path = (diffBlock.to === '/dev/null') ? diffBlock.from : diffBlock.to;
          return (<DiffFile
            buildRev={(coverage.build_changeset).substring(0, 12)}
            diffBlock={diffBlock}
            fileCoverageDiffs={(coverage) ? coverage.diffs[path] : undefined}
            key={path}
            path={path}
          />);
        })}
        <CoverageFooter
          gitBuildCommit={coverage.git_build_changeset}
          hgNode={coverage.node}
        />
      </div>
    )}
  </div>
);

const CoverageMeta = ({
  node, overallCoverage, repoName, summary,
}) => (
  <div className="coverage-meta">
    <div className="coverage-meta-row">
      <span className="meta">
        {`Current coverage: ${overallCoverage.substring(0, 4)}%`}
      </span>
      <span className="meta meta-right">
        <a href={pushlogUrl(repoName, node)} target="_blank">Push Log</a>
      </span>
    </div>
    <div className="coverage-meta-row">
      <span className="meta">{summary}</span>
      <span className="meta meta-right">
        <a href={hgDiffUrl(repoName, node)} target="_blank">Hg Diff</a>
      </span>
    </div>
  </div>
);

const CoverageFooter = ({ gitBuildCommit, hgNode }) => (
  <div className="meta-footer">
    <a href={githubUrl(gitBuildCommit)} target="_blank">GitHub</a>
    <a href={codecovUrl(gitBuildCommit)} target="_blank">Codecov</a>
    <a href={ccovBackendUrl(hgNode)} target="_blank">Coverage Backend</a>
  </div>
);

/* A DiffLine contains all diff changes for a specific file */
const DiffFile = ({
  buildRev, diffBlock, fileCoverageDiffs, path,
}) => (
  <div className="diff-file">
    <div className="file-summary">
      <div className="file-path">
        <Link
          className="diff-viewer-link"
          to={`/file?revision=${buildRev}&path=${path}`}
          href={`/file?revision=${buildRev}&path=${path}`}
        >
          {path}
        </Link>
      </div>
    </div>
    {diffBlock.chunks.map(block => (
      <DiffBlock
        block={block}
        filePath={path}
        fileDiffs={fileCoverageDiffs}
        key={block.content}
      />
    ))}
  </div>
);

const uniqueLineId = (filePath, change) => {
  let lineNumber;
  if (change.ln) {
    lineNumber = change.ln;
  } else if (change.ln2) {
    lineNumber = change.ln2;
  } else {
    lineNumber = change.ln1;
  }
  return `${hash(filePath)}-${change.type}-${lineNumber}`;
};

/* A DiffBlock is *one* of the blocks changed for a specific file */
const DiffBlock = ({ filePath, block, fileDiffs }) => (
  <div>
    <div className="diff-line-at">{block.content}</div>
    <div className="diff-block">
      <table className="diff-block-table">
        <tbody>
          {block.changes.map((change) => {
            const uid = uniqueLineId(filePath, change);
            return (<DiffLine
              key={uid}
              id={uid}
              change={change}
              fileDiffs={fileDiffs}
            />);
          })}
        </tbody>
      </table>
    </div>
  </div>
);

/* A DiffLine contains metadata about a line in a DiffBlock */
const DiffLine = ({ change, fileDiffs, id }) => {
  const c = change; // Information about the line itself
  const changeType = change.type; // Added, deleted or unchanged line
  let rowClass = 'nolinechange'; // CSS tr and td classes
  const rowId = id;
  let [oldLineNumber, newLineNumber] = ['', '']; // Cell contents

  if (changeType === 'add') {
    // Added line - <blank> | <new line number>
    if (fileDiffs) {
      try {
        const coverage = fileDiffs.lines[c.ln];
        if (coverage === 'Y') {
          rowClass = 'hit';
        } else if (coverage === '?') {
          rowClass = 'nolinechange';
        } else {
          rowClass = 'miss';
        }
      } catch (e) {
        console.log(e);
        rowClass = 'miss';
      }
    }
    newLineNumber = c.ln;
  } else if (changeType === 'del') {
    // Removed line - <old line number> | <blank>
    oldLineNumber = c.ln;
  } else {
    // Unchanged line - <old line number> | <blank>
    oldLineNumber = c.ln1;
    if (oldLineNumber !== c.ln2) {
      newLineNumber = c.ln2;
    }
  }

  return (
    <tr id={rowId} className={`${rowClass} diff-row`}>
      <td className="old-line-number diff-cell">{oldLineNumber}</td>
      <td className="new-line-number diff-cell">{newLineNumber}</td>
      <td className="line-content diff-cell">
        <pre>{c.content}</pre>
      </td>
    </tr>
  );
};

export default DiffViewer;
