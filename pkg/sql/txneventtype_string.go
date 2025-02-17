// Copyright 2023 The Cockroach Authors.
//
// Use of this software is governed by the CockroachDB Software License
// included in the /LICENSE file.

// Code generated by "stringer"; DO NOT EDIT.

package sql

import "strconv"

func _() {
	// An "invalid array index" compiler error signifies that the constant values have changed.
	// Re-run the stringer command to generate them again.
	var x [1]struct{}
	_ = x[noEvent-0]
	_ = x[txnStart-1]
	_ = x[txnCommit-2]
	_ = x[txnRollback-3]
	_ = x[txnPrepare-4]
	_ = x[txnRestart-5]
	_ = x[txnUpgradeToExplicit-6]
}

func (i txnEventType) String() string {
	switch i {
	case noEvent:
		return "noEvent"
	case txnStart:
		return "txnStart"
	case txnCommit:
		return "txnCommit"
	case txnRollback:
		return "txnRollback"
	case txnPrepare:
		return "txnPrepare"
	case txnRestart:
		return "txnRestart"
	case txnUpgradeToExplicit:
		return "txnUpgradeToExplicit"
	default:
		return "txnEventType(" + strconv.FormatInt(int64(i), 10) + ")"
	}
}
