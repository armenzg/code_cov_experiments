import React, { Component } from 'react';

/* A DiffLine contains metadata about a line in a DiffBlock */
export function DiffLine(props) {
  // Information about the line itself
  var c = props.change
  var cov = props.code_cov_info
  // Added, deleted or unchanged line
  var change_type = props.change.type
  // CSS tr and td classes
  var [row_class, cov_status_class] = ['nolinechange', 'nocovchange']
  var row_id = props.id
  // Cell contents
  var cov_status = ' ' // We need blank string to respect width value of cell
  var [old_line_number, new_line_number] = ['', '']

  if (change_type === 'add') {
    // Added line - <cov_status> | <blank> | <new line number>
    row_class = change_type
    cov_status_class = 'miss' // Let's start assuming a miss
    if (cov) {
      cov.changes.new.map(line_cov_info => {

        if (line_cov_info.line === c.ln) {
          // c.content has a '+' sign at the beginning of the line
          if (line_cov_info.content !== c.content.substring(1, c.content.length)) {
            console.error('The diff line and code coverage line differ.')
            console.log(line_cov_info.content)
            console.log(c.content.substring(1,c.content.length))
          }
          if (line_cov_info.coverage) {
            cov_status_class = 'hit'
          }
        }
      })
    }
    new_line_number = c.ln
  } else if (change_type === 'del') {
    // Removed line - <blank> | <old line number> | <blank>
    row_class = change_type
    old_line_number = c.ln
  } else {
    // Unchanged line - <blank> | <old line number> | <blank>
    row_class = change_type
    old_line_number = c.ln1
    if (old_line_number !== c.ln2) {
      new_line_number = c.ln2
    }
  }
  return (
    <tr id={row_id} className={row_class}>
      <td className={cov_status_class}>{cov_status}</td>
      <td className='old_line_number'>{old_line_number}</td>
      <td className='new_line_number'>{new_line_number}</td>
      <td className='line_content'>
        <pre>{c.content}</pre>
      </td>
    </tr>
  );
}
