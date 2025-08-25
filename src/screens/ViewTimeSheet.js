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

const LabourModal = ({
  visible,
  setShowAddLabour,
  editingLabour,
  setEditingLabour,
  tempLabourData,
  setTempLabourData,
  handleSaveLabour,
}) => (
  <Modal
    visible={visible}
    animationType="slide"
    transparent
    onRequestClose={() => {
      setShowAddLabour(false);
      setEditingLabour(null);
      setTempLabourData({});
    }}>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        {/* ✅ KeyboardAvoidingView Added */}
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 80 : 0}>
          <ScrollView
            contentContainerStyle={styles.modalBody}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}>
            {/* Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingLabour ? 'Edit Labour Entry' : 'Add Labour Entry'}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowAddLabour(false);
                  setEditingLabour(null);
                  setTempLabourData({});
                }}>
                <Text style={styles.modalCloseButton}>✕</Text>
              </TouchableOpacity>
            </View>

            {/* Form Fields */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Employee Name</Text>
              <TextInput
                style={styles.formInput}
                value={tempLabourData.employeeName || ''}
                onChangeText={text =>
                  setTempLabourData(prev => ({...prev, employeeName: text}))
                }
                placeholder="Enter employee name"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Employee ID</Text>
              <TextInput
                style={styles.formInput}
                value={tempLabourData.employeeId || ''}
                onChangeText={text =>
                  setTempLabourData(prev => ({...prev, employeeId: text}))
                }
                placeholder="Enter employee ID"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Regular Hours</Text>
              <TextInput
                style={styles.formInput}
                value={tempLabourData.regularHours?.toString() || ''}
                onChangeText={text =>
                  setTempLabourData(prev => ({
                    ...prev,
                    regularHours: text === '' ? '' : parseFloat(text) || 0,
                  }))
                }
                placeholder="0"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Overtime Hours</Text>
              <TextInput
                style={styles.formInput}
                value={tempLabourData.overtimeHours?.toString() || ''}
                onChangeText={text =>
                  setTempLabourData(prev => ({
                    ...prev,
                    overtimeHours: text === '' ? '' : parseFloat(text) || 0,
                  }))
                }
                placeholder="0"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>Notes</Text>
              <TextInput
                style={[styles.formInput, styles.textArea]}
                value={tempLabourData.notes || ''}
                onChangeText={text =>
                  setTempLabourData(prev => ({...prev, notes: text}))
                }
                placeholder="Enter notes"
                multiline
                numberOfLines={3}
              />
            </View>
          </ScrollView>

          {/* Footer Buttons */}
          <View style={styles.modalFooter}>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonSecondary]}
              onPress={() => {
                setShowAddLabour(false);
                setEditingLabour(null);
                setTempLabourData({});
              }}>
              <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalButton, styles.modalButtonPrimary]}
              onPress={handleSaveLabour}>
              <Text style={styles.modalButtonTextPrimary}>Save</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  </Modal>
);

const MaterialModal = ({
  visible,
  onClose,
  tempMaterialData,
  setTempMaterialData,
  editingMaterial,
  setEditingMaterial,
  handleSaveMaterial,
}) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {editingMaterial ? 'Edit Material Entry' : 'Add Material Entry'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCloseButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Material Name</Text>
            <TextInput
              style={styles.formInput}
              value={tempMaterialData.name || ''}
              onChangeText={text =>
                setTempMaterialData(prev => ({...prev, name: text}))
              }
              placeholder="Enter material name"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Unit</Text>
            <TextInput
              style={styles.formInput}
              value={tempMaterialData.unit || ''}
              onChangeText={text =>
                setTempMaterialData(prev => ({...prev, unit: text}))
              }
              placeholder="pieces, feet, etc."
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Total Ordered</Text>
            <TextInput
              style={styles.formInput}
              value={tempMaterialData.totalOrdered?.toString() || ''}
              onChangeText={text =>
                setTempMaterialData(prev => ({
                  ...prev,
                  totalOrdered: parseFloat(text) || 0,
                }))
              }
              placeholder="0"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Material Used</Text>
            <TextInput
              style={styles.formInput}
              value={tempMaterialData.amountUsed?.toString() || ''}
              onChangeText={text =>
                setTempMaterialData(prev => ({
                  ...prev,
                  amountUsed: parseFloat(text) || 0,
                }))
              }
              placeholder="0"
              keyboardType="numeric"
            />
          </View>

          {/* <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Unit Cost ($)</Text>
            <TextInput
              style={styles.formInput}
              value={tempMaterialData.unitCost?.toString() || ''}
              onChangeText={text =>
                setTempMaterialData(prev => ({
                  ...prev,
                  unitCost: parseFloat(text) || 0,
                }))
              }
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View> */}

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Supplier Order ID</Text>
            <TextInput
              style={styles.formInput}
              value={tempMaterialData.supplierOrderId || ''}
              onChangeText={text =>
                setTempMaterialData(prev => ({
                  ...prev,
                  supplierOrderId: text,
                }))
              }
              placeholder="Enter order ID"
            />
          </View>

          <View style={styles.switchGroup}>
            <Text style={styles.formLabel}>Return to Warehouse</Text>
            <Switch
              value={tempMaterialData.returnToWarehouse || false}
              onValueChange={value =>
                setTempMaterialData(prev => ({
                  ...prev,
                  returnToWarehouse: value,
                }))
              }
              trackColor={{false: '#e5e7eb', true: '#3B82F6'}}
              thumbColor={
                tempMaterialData.returnToWarehouse ? '#ffffff' : '#f4f3f4'
              }
            />
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonSecondary]}
            onPress={() => {
              setShowAddMaterial(false);
              setEditingMaterial(null);
              setTempMaterialData({});
            }}>
            <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonPrimary]}
            onPress={handleSaveMaterial}>
            <Text style={styles.modalButtonTextPrimary}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);

const ChargeModal = ({
  visible,
  onClose,
  tempChargeData,
  setTempChargeData,
  editingCharge,
  setEditingCharge,
  handleSaveCharge,
}) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContent}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {editingCharge ? 'Edit Additional Charge' : 'Add Additional Charge'}
          </Text>
          <TouchableOpacity onPress={onClose}>
            <Text style={styles.modalCloseButton}>✕</Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.modalBody}>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Description</Text>
            <TextInput
              style={styles.formInput}
              value={tempChargeData.description || ''}
              onChangeText={text =>
                setTempChargeData(prev => ({...prev, description: text}))
              }
              placeholder="Enter charge description"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Category</Text>
            <TextInput
              style={styles.formInput}
              value={tempChargeData.category || ''}
              onChangeText={text =>
                setTempChargeData(prev => ({...prev, category: text}))
              }
              placeholder="Equipment, Travel, Permits, etc."
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Amount ($)</Text>
            <TextInput
              style={styles.formInput}
              value={tempChargeData.amount?.toString() || ''}
              onChangeText={text =>
                setTempChargeData(prev => ({
                  ...prev,
                  amount: parseFloat(text) || 0,
                }))
              }
              placeholder="0.00"
              keyboardType="numeric"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Receipt ID</Text>
            <TextInput
              style={styles.formInput}
              value={tempChargeData.receipt || ''}
              onChangeText={text =>
                setTempChargeData(prev => ({...prev, receipt: text}))
              }
              placeholder="Enter receipt ID"
            />
          </View>

          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Notes</Text>
            <TextInput
              style={[styles.formInput, styles.textArea]}
              value={tempChargeData.notes || ''}
              onChangeText={text =>
                setTempChargeData(prev => ({...prev, notes: text}))
              }
              placeholder="Enter notes"
              multiline
              numberOfLines={3}
            />
          </View>
        </ScrollView>

        <View style={styles.modalFooter}>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonSecondary]}
            onPress={() => {
              setShowAddCharge(false);
              setEditingCharge(null);
              setTempChargeData({});
            }}>
            <Text style={styles.modalButtonTextSecondary}>Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton, styles.modalButtonPrimary]}
            onPress={handleSaveCharge}>
            <Text style={styles.modalButtonTextPrimary}>Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  </Modal>
);
const TimesheetScreen = ({navigation, route, user, job}) => {
  const {timesheet} = route?.params || {};

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
            role: user?.role || 'Labor',
            regularHours: timesheet.labourHours,
            overtimeHours: 0,
            regularRate: user?.role === 'Lead Labor' ? 35 : 28,
            overtimeRate: user?.role === 'Lead Labor' ? 52.5 : 42,
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
          regularRate: user?.role === 'Lead Labor' ? 35 : 28,
          overtimeRate: user?.role === 'Lead Labor' ? 52.5 : 42,
          totalCost: user?.role === 'Lead Labor' ? 280 : 224,
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

  // Calculate totals
  const totals = useMemo(() => {
    const labourTotal = timesheetData.labourEntries.reduce(
      (sum, entry) => sum + entry.totalCost,
      0,
    );
    const materialTotal = timesheetData.materialEntries.reduce(
      (sum, entry) => sum + entry.amountUsed * entry.unitCost,
      0,
    );
    const chargesTotal = timesheetData.additionalCharges.reduce(
      (sum, charge) => sum + charge.amount,
      0,
    );
    const grandTotal = labourTotal + materialTotal + chargesTotal;

    return {
      labour: labourTotal,
      materials: materialTotal,
      charges: chargesTotal,
      grandTotal,
    };
  }, [timesheetData]);

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

  const canEdit = () => {
    return (
      timesheetData.status === 'draft' ||
      (user?.role === 'Lead Labor' && timesheetData.status === 'submitted') ||
      timesheetData.status === 'rejected'
    );
  };

  const isReadOnly = () => {
    return timesheetData.status === 'approved';
  };

  // Labour entry handlers
  const handleAddLabour = () => {
    setTempLabourData({
      id: `labour-${Date.now()}`,
      employeeName: '',
      employeeId: '',
      role: 'Labor',
      regularHours: 0,
      overtimeHours: 0,
      regularRate: 28,
      overtimeRate: 42,
      totalCost: 0,
      notes: '',
    });
    setShowAddLabour(true);
  };

  const handleSaveLabour = () => {
    if (!tempLabourData.employeeName || !tempLabourData.employeeId) {
      Alert.alert('Error', 'Please fill in employee name and ID');
      return;
    }

    const totalCost =
      (tempLabourData.regularHours || 0) * (tempLabourData.regularRate || 0) +
      (tempLabourData.overtimeHours || 0) * (tempLabourData.overtimeRate || 0);

    const newEntry = {
      ...tempLabourData,
      totalCost,
    };

    if (editingLabour) {
      setTimesheetData(prev => ({
        ...prev,
        labourEntries: prev.labourEntries.map(entry =>
          entry.id === editingLabour ? newEntry : entry,
        ),
      }));
      setEditingLabour(null);
    } else {
      setTimesheetData(prev => ({
        ...prev,
        labourEntries: [...prev.labourEntries, newEntry],
      }));
    }

    setShowAddLabour(false);
    setTempLabourData({});
  };

  const handleDeleteLabour = id => {
    Alert.alert(
      'Delete Labour Entry',
      'Are you sure you want to delete this labour entry?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTimesheetData(prev => ({
              ...prev,
              labourEntries: prev.labourEntries.filter(
                entry => entry.id !== id,
              ),
            }));
          },
        },
      ],
    );
  };

  // Material entry handlers
  const handleAddMaterial = () => {
    setTempMaterialData({
      id: `material-${Date.now()}`,
      name: '',
      unit: 'pieces',
      totalOrdered: 0,
      amountUsed: 0,
      amountRemaining: 0,
      unitCost: 0,
      totalCost: 0,
      supplierOrderId: '',
      returnToWarehouse: false,
    });
    setShowAddMaterial(true);
  };

  const handleSaveMaterial = () => {
    if (!tempMaterialData.name) {
      Alert.alert('Error', 'Please fill in material name');
      return;
    }

    const totalCost =
      (tempMaterialData.amountUsed || 0) * (tempMaterialData.unitCost || 0);
    const amountRemaining =
      (tempMaterialData.totalOrdered || 0) - (tempMaterialData.amountUsed || 0);

    const newEntry = {
      ...tempMaterialData,
      totalCost,
      amountRemaining,
    };

    if (editingMaterial) {
      setTimesheetData(prev => ({
        ...prev,
        materialEntries: prev.materialEntries.map(entry =>
          entry.id === editingMaterial ? newEntry : entry,
        ),
      }));
      setEditingMaterial(null);
    } else {
      setTimesheetData(prev => ({
        ...prev,
        materialEntries: [...prev.materialEntries, newEntry],
      }));
    }

    setShowAddMaterial(false);
    setTempMaterialData({});
  };

  const handleDeleteMaterial = id => {
    Alert.alert(
      'Delete Material Entry',
      'Are you sure you want to delete this material entry?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTimesheetData(prev => ({
              ...prev,
              materialEntries: prev.materialEntries.filter(
                entry => entry.id !== id,
              ),
            }));
          },
        },
      ],
    );
  };

  // Additional charge handlers
  const handleAddCharge = () => {
    setTempChargeData({
      id: `charge-${Date.now()}`,
      description: '',
      category: 'Other',
      amount: 0,
      receipt: '',
      notes: '',
    });
    setShowAddCharge(true);
  };

  const handleSaveCharge = () => {
    if (!tempChargeData.description) {
      Alert.alert('Error', 'Please fill in charge description');
      return;
    }

    const newEntry = tempChargeData;

    if (editingCharge) {
      setTimesheetData(prev => ({
        ...prev,
        additionalCharges: prev.additionalCharges.map(entry =>
          entry.id === editingCharge ? newEntry : entry,
        ),
      }));
      setEditingCharge(null);
    } else {
      setTimesheetData(prev => ({
        ...prev,
        additionalCharges: [...prev.additionalCharges, newEntry],
      }));
    }

    setShowAddCharge(false);
    setTempChargeData({});
  };

  const handleDeleteCharge = id => {
    Alert.alert(
      'Delete Additional Charge',
      'Are you sure you want to delete this charge?',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setTimesheetData(prev => ({
              ...prev,
              additionalCharges: prev.additionalCharges.filter(
                entry => entry.id !== id,
              ),
            }));
          },
        },
      ],
    );
  };

  // Submit for approval
  const handleSubmitForApproval = () => {
    if (timesheetData.labourEntries.length === 0) {
      Alert.alert('Error', 'Please add at least one labour entry');
      return;
    }

    const newStatus =
      timesheetData.status === 'rejected' ? 'submitted' : 'submitted';
    setTimesheetData(prev => ({
      ...prev,
      status: newStatus,
      submittedAt: new Date().toISOString(),
      rejectionReason: undefined, // Clear rejection reason on resubmit
    }));

    const message =
      timesheetData.status === 'rejected'
        ? 'Timesheet resubmitted for approval'
        : 'Timesheet submitted for approval';
    Alert.alert('Success', message);
  };

  // Approval handlers for Lead Labor
  const handleApprove = () => {
    setTimesheetData(prev => ({
      ...prev,
      status: 'approved',
      approvedAt: new Date().toISOString(),
      approvedBy: user?.name || 'Management',
    }));
    Alert.alert('Success', 'Timesheet approved');
  };

  const handleReject = () => {
    Alert.prompt(
      'Reject Timesheet',
      'Please provide a reason for rejection:',
      reason => {
        if (reason) {
          setTimesheetData(prev => ({
            ...prev,
            status: 'rejected',
            rejectionReason: reason,
          }));
          Alert.alert('Success', 'Timesheet rejected');
        }
      },
    );
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
            {timesheet ? timesheet.jobTitle : job?.title || 'Unknown Job'} •{' '}
            {formatDate(timesheetData.date)}
          </Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Status and Job Info */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.jobInfo}>
              <Text style={styles.jobTitle}>
                {timesheet ? timesheet.jobTitle : job?.title || 'Unknown Job'}
              </Text>
              <Text style={styles.jobCustomer}>
                {timesheet
                  ? timesheet.customer
                  : job?.customer?.name || 'Unknown Customer'}
              </Text>
              <Text style={styles.jobLocation}>
                {timesheet
                  ? timesheet.location
                  : job?.customer?.address || 'Unknown Location'}
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
                  {timesheetData.status.toUpperCase()}
                </Text>
              </View>
              {isReadOnly() && (
                <View style={styles.readOnlyBadge}>
                  <Text style={styles.readOnlyBadgeText}>READ-ONLY</Text>
                </View>
              )}
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
            {canEdit() && !isReadOnly() && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddLabour}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            )}
          </View>

          {timesheetData.labourEntries.map(entry => (
            <View key={entry.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryName}>{entry.employeeName}</Text>
                  <Text style={styles.entryDetails}>
                    {entry.role} • {entry.employeeId}
                  </Text>
                </View>
                {canEdit() && !isReadOnly() && (
                  <View style={styles.entryActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => {
                        setTempLabourData(entry);
                        setEditingLabour(entry.id);
                        setShowAddLabour(true);
                      }}>
                      <MaterialIcons name="edit" size={24} color={tabColor} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteLabour(entry.id)}>
                      <MaterialIcons
                        name="delete"
                        size={24}
                        color={'#dc2626'}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.entryDetails}>
                <View style={styles.entryRow}>
                  <Text style={styles.entryLabel}>Regular Hours:</Text>
                  <Text style={styles.entryValue}>
                    {entry.regularHours}h 
                  </Text>
                </View>
                <View style={styles.entryRow}>
                  <Text style={styles.entryLabel}>Overtime Hours:</Text>
                  <Text style={styles.entryValue}>
                    {entry.overtimeHours}h
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
            {canEdit() && !isReadOnly() && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddMaterial}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            )}
          </View>

          {timesheetData.materialEntries.map(material => (
            <View key={material.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryName}>{material.name}</Text>
                  <Text style={styles.entryDetails}>
                    Order ID: {material.supplierOrderId}
                  </Text>
                </View>
                {canEdit() && !isReadOnly() && (
                  <View style={styles.entryActions}>
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => {
                        setTempMaterialData(material);
                        setEditingMaterial(material.id);
                        setShowAddMaterial(true);
                      }}>
                      <MaterialIcons name="edit" size={24} color={tabColor} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.deleteButton}
                      onPress={() => handleDeleteMaterial(material.id)}>
                      <MaterialIcons
                        name="delete"
                        size={24}
                        color={'#dc2626'}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.materialGrid}>
                <View style={styles.materialGridItem}>
                  <Text style={styles.entryLabel}>Ordered:</Text>
                  <Text style={styles.entryValue}>
                    {material.totalOrdered} {material.unit}
                  </Text>
                </View>
                <View style={styles.materialGridItem}>
                  <Text style={styles.entryLabel}>Used:</Text>
                  <Text style={styles.entryValue}>
                    {material.amountUsed} {material.unit}
                  </Text>
                </View>
                <View style={styles.materialGridItem}>
                  <Text style={styles.entryLabel}>Remaining:</Text>
                  <Text style={styles.entryValue}>
                    {material.amountRemaining} {material.unit}
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

        {/* Additional Charges Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="attach-money" size={24} color={tabColor} />
            <Text style={styles.sectionTitle}>Additional Charges</Text>
            {canEdit() && !isReadOnly() && (
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddCharge}>
                <Text style={styles.addButtonText}>+</Text>
              </TouchableOpacity>
            )}
          </View>

          {timesheetData.additionalCharges.map(charge => (
            <View key={charge.id} style={styles.entryCard}>
              <View style={styles.entryHeader}>
                <View style={styles.entryInfo}>
                  <Text style={styles.entryName}>{charge.description}</Text>
                  <Text style={styles.entryDetails}>{charge.category}</Text>
                  {charge.receipt && (
                    <Text style={styles.entryDetails}>
                      Receipt: {charge.receipt}
                    </Text>
                  )}
                </View>
                <View style={styles.chargeAmount}>
                  <Text style={styles.chargeAmountValue}>2</Text>
                  {canEdit() && !isReadOnly() && (
                    <View style={styles.entryActions}>
                      <TouchableOpacity
                        style={styles.editButton}
                        onPress={() => {
                          setTempChargeData(charge);
                          setEditingCharge(charge.id);
                          setShowAddCharge(true);
                        }}>
                        <MaterialIcons name="edit" size={24} color={tabColor} />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.deleteButton}
                        onPress={() => handleDeleteCharge(charge.id)}>
                        <MaterialIcons
                          name="delete"
                          size={24}
                          color={'#dc2626'}
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
              {charge.notes && (
                <Text style={styles.entryNotes}>{charge.notes}</Text>
              )}
            </View>
          ))}

          {/* <View style={styles.sectionTotal}>
            <Text style={styles.sectionTotalLabel}>
              Total Additional Charges:
            </Text>
            <Text style={styles.sectionTotalValue}>
              ${totals.charges.toFixed(2)}
            </Text>
          </View> */}
        </View>

        {/* Notes Section */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="edit-note" size={26} color={tabColor} />
            <Text style={styles.sectionTitle}>Job Notes</Text>
          </View>
          <TextInput
            style={styles.notesInput}
            value={timesheetData.jobNotes}
            onChangeText={text =>
              setTimesheetData(prev => ({
                ...prev,
                jobNotes: text,
              }))
            }
            placeholder="Add any additional notes about the job..."
            multiline
            numberOfLines={4}
            editable={canEdit() && !isReadOnly()}
          />
        </View>

        {/* Summary and Submit */}
        <View style={styles.sectionCard}>
          <View style={styles.sectionHeader}>
            <MaterialIcons name="summarize" size={26} color={tabColor} />
            <Text style={styles.sectionTitle}>Summary</Text>
          </View>

          <View style={styles.summaryBreakdown}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Total Labour:</Text>
              <Text style={styles.summaryValue}>
                5{/* ${totals.labour.toFixed(2)} */}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Material:</Text>
              <Text style={styles.summaryValue}>
                {/* ${totals.materials.toFixed(2)} */}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Additional items:</Text>
              <Text style={styles.summaryValue}>
                3{/* ${totals.charges.toFixed(2)} */}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            {/* <View style={styles.summaryTotal}>
              <Text style={styles.summaryTotalLabel}>Total Cost:</Text>
              <Text style={styles.summaryTotalValue}>
                ${totals.grandTotal.toFixed(2)}
              </Text>
            </View> */}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {/* Submit/Resubmit Button */}
            {(timesheetData.status === 'draft' ||
              timesheetData.status === 'rejected') &&
              canEdit() &&
              !isReadOnly() && (
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    timesheetData.status === 'rejected' &&
                      styles.resubmitButton,
                  ]}
                  onPress={handleSubmitForApproval}>
                  <Text style={styles.submitButtonText}>
                    {timesheetData.status === 'rejected'
                      ? 'Resubmit for Approval'
                      : '✓ Submit for Approval'}
                  </Text>
                </TouchableOpacity>
              )}

            {/* Submitted Status */}
            {timesheetData.status === 'submitted' && (
              <View style={styles.submittedStatus}>
                <Text style={styles.submittedStatusTitle}>
                  Timesheet submitted for approval
                </Text>
                <Text style={styles.submittedStatusDetails}>
                  Submitted on{' '}
                  {timesheetData.submittedAt
                    ? new Date(timesheetData.submittedAt).toLocaleDateString(
                        'en-US',
                        {
                          month: 'numeric', // "August"
                          day: 'numeric',
                          year: 'numeric',
                        },
                      )
                    : // new Date(timesheetData.submittedAt).toLocaleDateString()
                      'Unknown'}
                </Text>
                {user?.role === 'Lead Labor' && (
                  <View style={styles.leadActions}>
                    <TouchableOpacity
                      style={styles.approveButton}
                      onPress={handleApprove}>
                      <Text style={styles.approveButtonText}>Approve</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.rejectButton}
                      onPress={handleReject}>
                      <Text style={styles.rejectButtonText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* Approved Status */}
            {timesheetData.status === 'approved' && (
              <View style={styles.approvedStatus}>
                <Text style={styles.approvedStatusTitle}>
                  Timesheet approved
                </Text>
                <Text style={styles.approvedStatusDetails}>
                  Approved by {timesheetData.approvedBy || 'Management'} on{' '}
                  {timesheetData.approvedAt
                    ? new Date(timesheetData.approvedAt).toLocaleDateString()
                    : 'Unknown'}
                </Text>
              </View>
            )}

            {/* Back to list button */}
            {timesheet && (
              <TouchableOpacity
                style={styles.backToListButton}
                onPress={() => navigation.navigate('TimeSheetScreen')}>
                <Text style={styles.backToListButtonText}>
                  Back to All Bluesheets
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>

      {/* Modals */}
      <LabourModal
        visible={showAddLabour}
        setShowAddLabour={setShowAddLabour}
        editingLabour={editingLabour}
        setEditingLabour={setEditingLabour}
        tempLabourData={tempLabourData}
        setTempLabourData={setTempLabourData}
        handleSaveLabour={handleSaveLabour}
      />
      <MaterialModal
        visible={showAddMaterial}
        onClose={() => setShowAddMaterial(false)}
        tempMaterialData={tempMaterialData}
        setTempMaterialData={setTempMaterialData}
        editingMaterial={editingMaterial}
        setEditingMaterial={setEditingMaterial}
        handleSaveMaterial={handleSaveMaterial}
      />

      <ChargeModal
        visible={showAddCharge}
        onClose={() => setShowAddCharge(false)}
        tempChargeData={tempChargeData}
        setTempChargeData={setTempChargeData}
        editingCharge={editingCharge}
        setEditingCharge={setEditingCharge}
        handleSaveCharge={handleSaveCharge}
      />
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
