import React, {useState, useMemo} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  StatusBar,
  SafeAreaView,
  Modal,
  Switch,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {tabColor} from '../constants/Color';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useSelector} from 'react-redux';

const TimesheetScreen = ({navigation, route, job}) => {
  const {timesheet} = route?.params || {};
  const user = useSelector(state => state.user.user);
  console.log('timesheettimesheet', timesheet);

  const [editingLabour, setEditingLabour] = useState(null);
  const [editingMaterial, setEditingMaterial] = useState(null);
  const [editingCharge, setEditingCharge] = useState(null);
  const [showAddLabour, setShowAddLabour] = useState(false);
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [showAddCharge, setShowAddCharge] = useState(false);

  // Initialize timesheet data - either from existing timesheet or create new
  const [timesheetData, setTimesheetData] = useState(() => {
    if (timesheet) {
      return {
        id: timesheet.id,
        jobId: timesheet.jobId,
        date: timesheet.date,
        status: timesheet.status,
        jobNotes: 'Main electrical work and installation',
        submittedAt: timesheet.submittedAt,
        approvedAt: timesheet.approvedAt,
        approvedBy: timesheet.approvedBy,
        rejectionReason: timesheet.rejectionReason,
        labourEntries: [
          {
            id: '1',
            employeeName: timesheet.submittedBy,
            employeeId: timesheet.employeeId,
            role: user?.management_type || 'Labor',
            regularHours: timesheet.labourHours,
            overtimeHours: 0,
            regularRate: user?.management_type === 'lead_labor' ? 35 : 28,
            overtimeRate: user?.management_type === 'lead_labor' ? 52.5 : 42,
            totalCost: timesheet.labourCost,
            notes: 'Loaded from existing timesheet',
          },
        ],
        materialEntries: [
          {
            id: '1',
            name: 'Electrical Wire 12AWG',
            unit: 'feet',
            totalOrdered: 500,
            amountUsed: Math.round(timesheet.materialCost / 0.85),
            amountRemaining: 500 - Math.round(timesheet.materialCost / 0.85),
            unitCost: 0.85,
            totalCost: timesheet.materialCost,
            supplierOrderId: 'ORD-2024-001',
            returnToWarehouse: false,
          },
        ],
        additionalCharges: [
          {
            id: '1',
            description: 'Additional Items',
            category: 'Other',
            amount:
              timesheet.totalCost -
              timesheet.labourCost -
              timesheet.materialCost,
            notes: 'Loaded from existing timesheet',
          },
        ],
      };
    }

    // Create new timesheet
    return {
      id: `timesheet-${job?.id || 'new'}-${
        new Date().toISOString().split('T')[0]
      }`,
      jobId: job?.id || 'unknown',
      date: new Date().toISOString().split('T')[0],
      status: 'draft',
      jobNotes: 'Main electrical work and installation',
      labourEntries: [
        {
          id: '1',
          employeeName: user?.name || 'Unknown Employee',
          employeeId: user?.employee_id || 'EMP001',
          role: user?.role || 'Labor',
          regularHours: 8,
          overtimeHours: 0,
          regularRate: user?.management_type === 'lead_labor' ? 35 : 28,
          overtimeRate: user?.management_type === 'lead_labor' ? 52.5 : 42,
          totalCost: user?.management_type === 'lead_labor' ? 280 : 224,
          notes: 'Main electrical work and installation',
        },
      ],
      materialEntries: [
        {
          id: '1',
          name: 'Electrical Wire 12AWG',
          unit: 'feet',
          totalOrdered: 500,
          amountUsed: 350,
          amountRemaining: 150,
          unitCost: 0.85,
          totalCost: 297.5,
          supplierOrderId: 'ORD-2024-001',
          returnToWarehouse: false,
        },
        {
          id: '2',
          name: 'Circuit Breakers 20A',
          unit: 'pieces',
          totalOrdered: 12,
          amountUsed: 8,
          amountRemaining: 4,
          unitCost: 25.0,
          totalCost: 200.0,
          supplierOrderId: 'ORD-2024-001',
          returnToWarehouse: false,
        },
      ],
      additionalCharges: [
        {
          id: '1',
          description: 'Parking permit for downtown work site',
          category: 'Permits',
          amount: 15.0,
          notes: 'Required for street work access',
        },
        {
          id: '2',
          description: 'Equipment rental - lift',
          category: 'Equipment',
          amount: 125.0,
          receipt: 'RCP-2024-001',
          notes: 'Half-day rental for overhead work',
        },
      ],
    };
  });
  // Temporary form state for editing
  const [tempLabourData, setTempLabourData] = useState({});
  const [tempMaterialData, setTempMaterialData] = useState({});
  const [tempChargeData, setTempChargeData] = useState({});

  // Helper functions
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusColor = status => {
    switch (status) {
      case 'draft':
        return {backgroundColor: '#f3f4f6', color: '#374151'};
      case 'submitted':
        return {backgroundColor: '#dbeafe', color: '#1d4ed8'};
      case 'approved':
        return {backgroundColor: '#dcfce7', color: '#166534'};
      case 'rejected':
        return {backgroundColor: '#fee2e2', color: '#dc2626'};
      default:
        return {backgroundColor: '#f3f4f6', color: '#374151'};
    }
  };

  // Navigation handler - go back to appropriate screen
  const handleBack = () => {
    if (timesheet) {
      // If viewing from timesheet listing, go back to listing
      navigation.goBack();
    } else {
      // If creating new timesheet, go back to job detail
      navigation.goBack();
    }
  };

  // Modal components

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#3B82F6" barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>
            {timesheet ? 'Bluesheet Details' : 'Daily Timesheet'}
          </Text>
          <Text style={styles.headerSubtitle}>
            {timesheet ? timesheet.job?.jobTitle : job?.title || 'Unknown Job'}{' '}
            • {/* {formatDate(timesheet?.created_at)} */}
          </Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status and Job Info */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>{timesheet?.job?.job_title}</Text>
              <Text style={styles.jobCustomer}>
                {timesheet?.job?.customer?.customer_name}
              </Text>
              <Text style={styles.jobLocation}>
                {timesheet?.job?.bill_to_address}
              </Text>
            </View>
            <View style={styles.statusBadges}>
              <View
                style={[
                  styles.statusBadge,
                  getStatusColor(timesheetData.status),
                ]}>
                <Text
                  style={[
                    styles.statusBadgeText,
                    {color: getStatusColor(timesheetData.status).color},
                  ]}>
                  {timesheetData?.status?.toUpperCase() || 'Pending'}
                </Text>
              </View>

              <View style={styles.readOnlyBadge}>
                <Text style={styles.readOnlyBadgeText}>READ-ONLY</Text>
              </View>
            </View>
          </View>

          {/* Status specific messages */}
          {timesheetData.status === 'rejected' &&
            timesheetData.rejectionReason && (
              <View style={styles.rejectionInfo}>
                <Text style={styles.rejectionIcon}>⚠️</Text>
                <View style={styles.rejectionText}>
                  <Text style={styles.rejectionTitle}>Timesheet Rejected</Text>
                  <Text style={styles.rejectionReason}>
                    {timesheetData.rejectionReason}
                  </Text>
                </View>
              </View>
            )}

          {timesheetData.status === 'approved' && timesheetData.approvedAt && (
            <View style={styles.approvalInfo}>
              <Text style={styles.approvalIcon}>✅</Text>
              <View style={styles.approvalText}>
                <Text style={styles.approvalTitle}>Timesheet Approved</Text>
                <Text style={styles.approvalDetails}>
                  Approved by {timesheetData.approvedBy || 'Management'} on{' '}
                  {new Date(timesheetData.approvedAt).toLocaleDateString()}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Labour Hours Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Feather name="clock" size={20} color={tabColor} />
            <Text style={styles.sectionTitle}>Labour Hours</Text>
          </View>

          {timesheet?.labor_entries?.map(entry => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryName}>{entry?.employee_name}</Text>
                  <Text style={styles.entryDetails}></Text>
                </View>
              </View>

              <View style={styles.entryDetails}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryLabel}>Regular Hours:</Text>
                  <Text style={styles.entryValue}>{entry?.total_hours}</Text>
                </View>
                <View style={styles.entryRow}>
                  <Text style={styles.entryLabel}>Overtime Hours:</Text>
                  <Text style={styles.entryValue}>
                    {entry?.overtime_hours == '00:00:00'
                      ? '0h'
                      : entry?.overtime_hours}
                  </Text>
                </View>
                {/* <View style={styles.entryCostRow}>
                  <Text style={styles.entryCostLabel}>Total Labour Cost:</Text>
                  <Text style={styles.entryCostValue}>
                    ${entry.totalCost.toFixed(2)}
                  </Text>
                </View> */}
                {entry.notes && (
                  <Text style={styles.entryNotes}>{entry.notes}</Text>
                )}
              </View>
            </View>
          ))}

          {/* <View style={styles.sectionTotal}>
            <Text style={styles.sectionTotalLabel}>Total Labour Cost:</Text>
            <Text style={styles.sectionTotalValue}>
              ${totals.labour.toFixed(2)}
            </Text>
          </View> */}
        </View>

        {/* Materials Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <Feather name="box" size={20} color={tabColor} />
            <Text style={styles.sectionTitle}>Materials</Text>
          </View>

          {timesheet?.material_entries?.map(material => (
            <View key={material.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryName}>{material.name}</Text>
                  <Text style={styles.entryDetails}>
                    Order ID: {material.supplier_order_id}
                  </Text>
                </View>
              </View>

              <View style={styles.materialGrid}>
                <View style={styles.materialGridItem}>
                  <Text style={styles.entryLabel}>Ordered:</Text>
                  <Text style={styles.entryValue}>
                    {material.quantity} {material.unit}
                  </Text>
                </View>
                <View style={styles.materialGridItem}>
                  <Text style={styles.entryLabel}>Used:</Text>
                  <Text style={styles.entryValue}>
                    {material.material_used} {material.unit}
                  </Text>
                </View>
                <View style={styles.materialGridItem}>
                  <Text style={styles.entryLabel}>Remaining:</Text>
                  <Text style={styles.entryValue}>
                    {material?.quantity - material.material_used}{' '}
                    {material.unit}
                  </Text>
                </View>
              </View>

              <View style={styles.materialFooter}>
                {/* <View style={styles.materialCost}>
                  <Text style={styles.entryLabel}>Cost:</Text>
                  <Text style={styles.entryValue}>
                    ${material.totalCost.toFixed(2)}
                  </Text>
                </View> */}

                {/* {material.amountRemaining > 0 && (
                  <View style={styles.returnStatus}>
                    <Text
                      style={[
                        styles.returnStatusText,
                        material.returnToWarehouse
                          ? styles.returnStatusWarehouse
                          : styles.returnStatusSite,
                      ]}>
                      {material.returnToWarehouse
                        ? '🏢 Return to Warehouse'
                        : '🚛 Keep on Site'}
                    </Text>
                  </View>
                )} */}
              </View>
            </View>
          ))}
          {/* 
          <View style={styles.sectionTotal}>
            <Text style={styles.sectionTotalLabel}>Total Material Cost:</Text>
            <Text style={[styles.sectionTotalValue, {fontSize: 20}]}>
              ${totals.materials.toFixed(2)}
            </Text>
          </View> */}
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    marginBottom: 70,
  },
  header: {
    backgroundColor: '#3B82F6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingTop: 20,
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: '600',
  },
  headerContent: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  headerSubtitle: {
    color: '#93c5fd',
    fontSize: 14,
    marginTop: 2,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: 'white',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  jobInfo: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  jobCustomer: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 2,
  },
  jobLocation: {
    fontSize: 14,
    color: '#9ca3af',
  },
  statusBadges: {
    alignItems: 'flex-end',
    gap: 8,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  readOnlyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  readOnlyBadgeText: {
    fontSize: 10,
    color: '#6b7280',
    fontWeight: '600',
  },
  rejectionInfo: {
    backgroundColor: '#fee2e2',
    borderLeftWidth: 4,
    borderLeftColor: '#dc2626',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  rejectionIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  rejectionText: {
    flex: 1,
  },
  rejectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#dc2626',
    marginBottom: 4,
  },
  rejectionReason: {
    fontSize: 14,
    color: '#dc2626',
  },
  approvalInfo: {
    backgroundColor: '#dcfce7',
    borderLeftWidth: 4,
    borderLeftColor: '#16a34a',
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  approvalIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  approvalText: {
    flex: 1,
  },
  approvalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#16a34a',
    marginBottom: 4,
  },
  approvalDetails: {
    fontSize: 14,
    color: '#16a34a',
  },
  sectionCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: 8,
    color: '#3B82F6',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3B82F6',
    flex: 1,
    marginLeft: 10,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: '600',
  },
  entryCard: {
    backgroundColor: '#f9fafb',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  entryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  entryInfo: {
    flex: 1,
  },
  entryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  entryDetails: {
    fontSize: 14,
    color: '#6b7280',
  },
  entryActions: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 16,
  },
  deleteButton: {
    padding: 8,
  },
  deleteButtonText: {
    fontSize: 16,
  },
  entryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  entryLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  entryValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  entryCostRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
    marginTop: 8,
  },
  entryCostLabel: {
    fontSize: 14,
    color: '#6b7280',
  },
  entryCostValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
  },
  entryNotes: {
    fontSize: 14,
    color: '#6b7280',
    fontStyle: 'italic',
    marginTop: 8,
  },
  materialGrid: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  materialGridItem: {
    flex: 1,
    alignItems: 'center',
  },
  materialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 8,
  },
  materialCost: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  returnStatus: {
    flex: 1,
    alignItems: 'flex-end',
  },
  returnStatusText: {
    fontSize: 12,
    fontWeight: '600',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  returnStatusWarehouse: {
    backgroundColor: '#dcfce7',
    color: '#166534',
  },
  returnStatusSite: {
    backgroundColor: '#fef3c7',
    color: '#d97706',
  },
  chargeAmount: {
    alignItems: 'flex-end',
  },
  chargeAmountValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 4,
  },
  sectionTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingTop: 16,
  },
  sectionTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  sectionTotalValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3B82F6',
  },
  notesInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
    backgroundColor: '#f9fafb',
    textAlignVertical: 'top',
    minHeight: 96,
  },
  summaryBreakdown: {
    marginBottom: 24,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 12,
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  summaryTotalValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#3B82F6',
  },
  actionButtons: {
    gap: 12,
  },
  submitButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  resubmitButton: {
    backgroundColor: '#ea580c',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  submittedStatus: {
    backgroundColor: '#dbeafe',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  submittedStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1d4ed8',
    marginBottom: 4,
  },
  submittedStatusDetails: {
    fontSize: 14,
    color: '#1d4ed8',
    marginBottom: 12,
  },
  leadActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  approveButton: {
    backgroundColor: '#16a34a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  approveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  rejectButton: {
    backgroundColor: 'transparent',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#dc2626',
  },
  rejectButtonText: {
    color: '#dc2626',
    fontSize: 14,
    fontWeight: '600',
  },
  approvedStatus: {
    backgroundColor: '#dcfce7',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  approvedStatusTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#16a34a',
    marginBottom: 4,
  },
  approvedStatusDetails: {
    fontSize: 14,
    color: '#16a34a',
    textAlign: 'center',
  },
  backToListButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
  },
  backToListButtonText: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacing: {
    height: 28,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 12,
    margin: 20,
    maxHeight: '80%',
    width: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  modalCloseButton: {
    fontSize: 18,
    color: '#6b7280',
    padding: 8,
  },
  modalBody: {
    padding: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  switchGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  modalButtonPrimary: {
    backgroundColor: '#3B82F6',
  },
  modalButtonSecondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  modalButtonTextPrimary: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalButtonTextSecondary: {
    color: '#6b7280',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default TimesheetScreen;
