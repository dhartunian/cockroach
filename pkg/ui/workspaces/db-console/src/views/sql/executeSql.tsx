// Copyright 2022 The Cockroach Authors.
//
// Use of this software is governed by the Business Source License
// included in the file licenses/BSL.txt.
//
// As of the Change Date specified in that file, in accordance with
// the Business Source License, use of this software will be governed
// by the Apache License, Version 2.0, included in the file
// licenses/APL.txt.

import React from "react";
import { Button, Icon, TextInput } from "@cockroachlabs/ui-components";
import {
  ColumnDescriptor,
  EmptyTable,
  PageConfig,
  PageConfigItem,
  SortedTable,
} from "@cockroachlabs/cluster-ui";
import { useState } from "react";

const StatementInput = ({
  value,
  onChange,
}: {
  value: string;
  onChange?: (s: string) => void;
}) => {
  return (
    <TextInput
      value={value}
      width={500}
      onChange={e => {
        onChange(e.target.value);
      }}
    />
  );
};

interface SQLColumn {
  name: string;
  oid: number;
  type: string;
}

type SQLRow = any;

interface SQLTxnResult {
  columns: [SQLColumn];
  end: string;
  rows?: [SQLRow];
  rows_affected?: number;
  start: string;
  statement: number;
  tag: string;
}

interface SQLResult {
  execution: {
    retries: number;
    txn_results: [SQLTxnResult];
  };
  num_statements: number;
  txn_error?: {
    code: string;
    message: string;
  };
}

interface InternalRow {
  [k: string]: string | number;
}

export const SQLToTableColumnDescriptors = (
  r: SQLTxnResult,
): ColumnDescriptor<InternalRow>[] => {
  return r.columns.map(c => {
    return {
      title: c.name,
      name: c.name,
      cell: (r: InternalRow) => <pre>{r[c.name]}</pre>,
    };
  });
};

class SQLTable extends SortedTable<InternalRow> {}

export const ExecuteSQL = () => {
  const [stmt, setStmt] = useState("select * from intro.mytable");
  const [executionOutput, setExecutionOutput] = useState<SQLResult>(null);

  const currentSessionCookie: string[] = document.cookie
    .split(";")
    .map(cookieString => {
      return cookieString.split("=").map(kv => {
        return kv.trim();
      });
    })
    .find(cookie => {
      return cookie[0] === "session";
    });

  const executeStmt = () => {
    fetch("/api/v2/sql/", {
      method: "POST",
      headers: {
        "X-Cockroach-API-Session": currentSessionCookie
          ? currentSessionCookie[0]
          : "CIGA1sOgg9i9ChIQpeGYPK4aN0Jt4NiFVkip3Q==",
      },
      body: new URLSearchParams({ sql: stmt, execute: "true" }),
    })
      .then(r => r.json())
      .then((r: SQLResult) => {
        setExecutionOutput(r);
      });
  };

  return (
    <>
      <h3 className="base-heading">Execute SQL</h3>
      <PageConfig>
        <PageConfigItem>
          <StatementInput value={stmt} onChange={setStmt} />
        </PageConfigItem>
        <PageConfigItem>
          <Button onClick={executeStmt} intent="primary">
            <Icon iconName="Download" /> Fire!
          </Button>
        </PageConfigItem>
      </PageConfig>
      {executionOutput ? (
        executionOutput.execution?.txn_results?.map(tr => {
          return tr.rows ? (
            <section className="section" style={{ maxWidth: "none" }}>
              <SQLTable
                data={tr.rows}
                columns={SQLToTableColumnDescriptors(tr)}
                renderNoResult={<EmptyTable title="no results" />}
              />
            </section>
          ) : (
            <EmptyTable title="no results" />
          );
        })
      ) : (
        <EmptyTable title="Nothing executed" />
      )}
    </>
  );
};
