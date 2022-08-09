package statusccl

import (
	"context"
	"encoding/json"
	"net/http"
	"testing"

	"github.com/cockroachdb/cockroach/pkg/server/serverpb"
	"github.com/cockroachdb/cockroach/pkg/sql/tests"
	"github.com/cockroachdb/cockroach/pkg/util/leaktest"
	"github.com/cockroachdb/cockroach/pkg/util/log"
	"github.com/stretchr/testify/require"
)

func TestHealthV2Tenant(t *testing.T) {
	defer leaktest.AfterTest(t)()
	defer log.Scope(t).Close(t)

	knobs := tests.CreateTestingKnobs()
	ctx := context.Background()
	testHelper := newTestTenantHelper(t, 3 /* tenantClusterSize */, knobs)
	defer testHelper.cleanup(ctx, t)

	cluster := testHelper.testCluster()
	httpClient := cluster.tenantHTTPClient(t, 0, false)

	req, err := http.NewRequest("GET", httpClient.baseURL+"/api/v2/"+"health/", nil)
	require.NoError(t, err)
	resp, err := httpClient.client.Do(req)
	require.NoError(t, err)
	require.NotNil(t, resp)

	// Check if the response was a 200.
	require.Equal(t, 200, resp.StatusCode)
	// Check if an unmarshal into the (empty) HealthResponse struct works.
	var hr serverpb.HealthResponse
	require.NoError(t, json.NewDecoder(resp.Body).Decode(&hr))
	require.NoError(t, resp.Body.Close())
}
